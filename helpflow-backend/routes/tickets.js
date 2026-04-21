const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.ticket_id,
        t.title,
        t.requesterName,
        t.createdAt,
        t.status_id,
        s.name AS statusName
      FROM tickets t
      LEFT JOIN status s ON t.status_id = s.status_id
      ORDER BY createdAt DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;