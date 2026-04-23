const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all tickets with status name, supporter name, priority name and category name
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.ticket_id,
        t.title,
        t.requesterName,
        t.createdAt,
        t.updatedAt,
        t.closedAt,
        p.name as priorityName,
        s.name AS statusName,
        i.name as supporterName,
        c.name as categoryName,
        c.sla_id,
        sla.resolveHours
      FROM tickets t
      LEFT JOIN status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      LEFT JOIN supporters i ON t.supporter_id = i.supporter_id
      LEFT JOIN categories c ON t.category_id = c.category_id
      LEFT JOIN sla ON c.sla_id = sla.sla_id
      ORDER BY createdAt DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;