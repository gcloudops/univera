const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE is_active=true ORDER BY name');
    res.json({ success: true, courses: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id=$1', [req.params.id]);
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;