const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all SLA policies
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
            s.sla_id,
            s.serviceName,
            s.responseHours,
            s.resolveHours
        FROM sla s
        ORDER BY s.sla_id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new SLA policy and link it to a category
router.post('/', async (req, res) => {
  const { categoryName, responseHours, resolveHours } = req.body;

  // Input validation for required fields and numeric values
  if (!categoryName || (responseHours === undefined || responseHours <= 0) || (resolveHours === undefined || resolveHours <= 0)) {
    return res.status(400).json({
      error: 'categoryName, responseHours, and resolveHours are required',
    });
  }

  const responseValue = Number(responseHours);
  const resolveValue = Number(resolveHours);
  const trimmedCategoryName = String(categoryName).trim();

  // Input validation for categoryName and numeric values
  if (!trimmedCategoryName || Number.isNaN(responseValue) || Number.isNaN(resolveValue)) {
    return res.status(400).json({ error: 'Invalid SLA values provided' });
  }

  const serviceName = `${trimmedCategoryName} service`;
  const connection = await db.getConnection();

  // inserts a new SLA policy and links it to the category, creating the category if it doesn't exist
  try {
    await connection.beginTransaction();

    const [slaResult] = await connection.query(
      `
        INSERT INTO sla (serviceName, responseHours, resolveHours)
        VALUES (?, ?, ?)
      `,
      [serviceName, responseValue, resolveValue]
    );

    const slaId = slaResult.insertId;

    const [existingCategories] = await connection.query(
      `
        SELECT category_id
        FROM categories
        WHERE name = ?
        LIMIT 1
      `,
      [trimmedCategoryName]
    );

    if (existingCategories.length > 0) {
      await connection.query(
        `
          UPDATE categories
          SET sla_id = ?
          WHERE category_id = ?
        `,
        [slaId, existingCategories[0].category_id]
      );
    } else {
      await connection.query(
        `
          INSERT INTO categories (name, sla_id)
          VALUES (?, ?)
        `,
        [trimmedCategoryName, slaId]
      );
    }

    await connection.commit();

    res.status(201).json({
      sla_id: slaId,
      serviceName,
      responseHours: responseValue,
      resolveHours: resolveValue,
      categoryName: trimmedCategoryName,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to create SLA policy', details: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;