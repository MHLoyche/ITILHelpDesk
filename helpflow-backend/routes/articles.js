const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM articles
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;