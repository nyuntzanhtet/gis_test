const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /Employee
router.get('/', async (req, res) => {
  const { cafe } = req.query;
  try {
    const query = cafe
      ? 'SELECT E.id, E.name, E.email_address, E.phone_number, E.gender, CURRENT_DATE - E.start_date AS total_days, C.name AS cafe_name, C.id AS cafe_id FROM public."employees" AS E INNER JOIN public."cafes" AS C ON E.cafe_id = C.id WHERE cafe_id = $1 ORDER BY total_days DESC'
      : 'SELECT E.id, E.name, E.email_address, E.phone_number, E.gender, CURRENT_DATE - E.start_date AS total_days, C.name AS cafe_name, C.id AS cafe_id FROM public."employees" AS E INNER JOIN public."cafes" AS C ON E.cafe_id = C.id ORDER BY total_days DESC;'

    const { rows } = await pool.query(query, cafe ? [cafe] : []);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /employee
router.post('/', async (req, res) => {
  const { name, email_address, phone_number, gender, cafe_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO public."employees" (id, name, email_address, gender, phone_number, start_date, cafe_id) VALUES (generate_custom_id(), $1, $2, $3, $4, CURRENT_DATE, $5) RETURNING *;',
      [name, email_address, gender, phone_number, cafe_id]
    );
    
    res.status(201).json({ id: rows[0].id, name, email_address, gender, phone_number, cafe_id, total_days: 0 });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Put /employee
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email_address, phone_number, cafe_id, gender } = req.body;
  try {
    await pool.query(
      'UPDATE public."employees" SET name = $1, email_address = $2, phone_number = $3, cafe_id = $4, gender = $5 WHERE id = $6;',
      [name, email_address, phone_number, cafe_id, gender, id]
    );
    res.status(201).json({ id, name, email_address, phone_number, gender, cafe_id });
  } catch (error) {
    console.error('Error adding employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /employee/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM public."employees" WHERE id = $1', [id]);
    res.json({ message: 'employees deleted successfully' });
  } catch (error) {
    console.error('Error deleting employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
