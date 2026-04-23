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

module.exports = router;