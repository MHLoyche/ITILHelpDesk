const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get comments for a ticket
router.get('/', async (req, res) => {
  const ticketId = Number(req.query.ticket_id);

  if (!ticketId) {
    return res.status(400).json({ error: 'ticket_id is required' });
  }

  try {
    const [rows] = await db.query(`
      SELECT
        comment_id,
        ticket_id,
        message,
        createdAt,
        authorName
      FROM comments
      WHERE ticket_id = ?
      ORDER BY createdAt ASC, comment_id ASC
    `, [ticketId]);

    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new comment for a ticket
router.post('/', async (req, res) => {
  const { ticket_id, message, authorName } = req.body;

  const parsedTicketId = Number(ticket_id);
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';
  const trimmedAuthor = typeof authorName === 'string' ? authorName.trim() : '';

  if (!parsedTicketId || !trimmedMessage || !trimmedAuthor) {
    return res.status(400).json({
      error: 'ticket_id, message, and authorName are required',
    });
  }

  try {
    const [ticketRows] = await db.query(
      'SELECT ticket_id FROM tickets WHERE ticket_id = ?',
      [parsedTicketId]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const [result] = await db.query(
      `
        INSERT INTO comments (ticket_id, message, authorName)
        VALUES (?, ?, ?)
      `,
      [parsedTicketId, trimmedMessage, trimmedAuthor]
    );

    const [createdRows] = await db.query(
      `
        SELECT
          comment_id,
          ticket_id,
          message,
          createdAt,
          authorName
        FROM comments
        WHERE comment_id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(createdRows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;