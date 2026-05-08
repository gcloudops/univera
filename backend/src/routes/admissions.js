const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.post('/', async (req, res) => {
  const { first_name, last_name, email, course_id, phone, percentage } = req.body;
  try {
    const appNum = 'APP' + Date.now();
    const result = await pool.query(
      `INSERT INTO applications
       (application_number,first_name,last_name,course_id,phone,percentage,status)
       VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING *`,
      [appNum, first_name, last_name, course_id, phone, percentage]
    );
    res.status(201).json({ success: true, application: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/status/:appNum', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM applications WHERE application_number=$1',
      [req.params.appNum]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, application: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;