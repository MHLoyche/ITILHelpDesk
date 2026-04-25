const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all supporters
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT
            supporter_id,
            name,
            email,
            phoneNumber
        FROM supporters
        ORDER BY supporter_id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;