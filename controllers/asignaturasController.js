const pool = require('../db/db');

const obtenerAsignaturas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM asignatura');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener asignaturas:', err);
    res.status(500).json({ error: 'Error al obtener asignaturas' });
  }
};

module.exports = { obtenerAsignaturas };
