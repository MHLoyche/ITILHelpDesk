const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                category_id,
                name
            FROM categories
            ORDER BY name
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;