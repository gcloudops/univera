const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json({ success: true, employees: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/leave', async (req, res) => {
  const { employee_id, leave_type, from_date, to_date, reason } = req.body;
  try {
    const days = Math.ceil(
      (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24)
    ) + 1;
    const result = await pool.query(
      `INSERT INTO leave_requests
       (employee_id,leave_type,from_date,to_date,days,reason)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [employee_id, leave_type, from_date, to_date, days, reason]
    );
    res.status(201).json({ success: true, leave: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;