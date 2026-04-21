const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ticket_id,
        title,
        requesterName,
        createdAt
      FROM tickets
      ORDER BY createdAt DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;