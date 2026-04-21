const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
            a.article_id,
            a.title,
            a.content,
            a.createdAt,
            a.updatedAt,
            a.authorName,
            a.category_id,
            c.name AS categoryName
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.category_id
        ORDER BY createdAt DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          a.article_id,
          a.title,
          a.content,
          a.createdAt,
          a.updatedAt,
          a.authorName,
          a.category_id,
          c.name AS categoryName
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.article_id = ?
      LIMIT 1
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;