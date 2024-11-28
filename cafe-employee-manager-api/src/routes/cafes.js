const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { v4: uuidv4 } = require('uuid');

const bufferToBase64 = (buffer) => {
  return buffer ? buffer.toString('base64') : null;
};

// GET /Cafe
router.get('/', async (req, res) => {
  const { location } = req.query;
  try {
    const query = location
      ? 'SELECT c.*, (SELECT COUNT(*) FROM public."Employee" e WHERE e.cafe_id = c.id) AS employee_count FROM public."Cafe" c WHERE location = $1 ORDER BY employee_count DESC;'
      : 'SELECT c.*, (SELECT COUNT(*) FROM public."Employee" e WHERE e.cafe_id = c.id) AS employee_count FROM public."Cafe" c ORDER BY employee_count DESC;';

    const { rows } = await pool.query(query, location ? [location] : []);
    res.json(rows.map(row => ({
      ...row,
      logo: bufferToBase64(row.logo),
    })));
  } catch (error) {
    console.error('Error fetching Cafe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /cafe
router.post('/', async (req, res) => {
  const { name, description, location, logo } = req.body;
  const id = uuidv4();
  const logoBuffer = logo ? Buffer.from(logo.split(',')[1], 'base64') : null;

  try {
    await pool.query(
      'INSERT INTO public."Cafe" (id, name, description, location, logo) VALUES ($1, $2, $3, $4, $5)',
      [id, name, description, location, logoBuffer]
    );
    res.status(201).json({ id, name, description, location, logo, employee_count: 0 });
  } catch (error) {
    console.error('Error adding cafe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /cafe/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, location, logo, employee_count, isUploaded = false } = req.body;
  const logoBuffer = isUploaded ? Buffer.from(logo.split(',')[1], 'base64') : null;

  try {
    if (isUploaded) {
      await pool.query(
        'UPDATE public."Cafe" SET name = $1, description = $2, location = $3, logo = $4 WHERE id = $5',
        [name, description, location, logoBuffer || null, id]
      );
    } else {
      await pool.query(
        'UPDATE public."Cafe" SET name = $1, description = $2, location = $3 WHERE id = $4',
        [name, description, location, id]
      );
    }
    res.json({ id, name, description, location, logo: isUploaded ? bufferToBase64(logoBuffer) : logo, employee_count });
  } catch (error) {
    console.error('Error updating cafe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /cafe/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM public."Cafe" WHERE id = $1', [id]);
    res.json({ message: 'Cafe deleted successfully' });
  } catch (error) {
    console.error('Error deleting cafe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
