const bcrypt = require('bcrypt');
const pool = require('../db/db');

const obtenerAlumnos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumno');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener alumnos:', err);
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
};

const crearAlumno = async (req, res) => {
  const { nombre, username, password_hash, email, carrera, rut } = req.body;

  if (!nombre || !username || !password_hash || !email || !rut) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Hash de la contraseña
    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(password_hash, saltRounds);

    const result = await pool.query(
      'INSERT INTO alumno (nombre, username, password_hash, email, carrera, rut) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, username, passwordEncriptada, email, carrera, rut]
    );

    // Nunca devuelver la contraseña en la respuesta
    delete result.rows[0].password_hash;

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear alumno:', err);
    res.status(500).json({ error: 'Error al crear alumno' });
  }
};

module.exports = { obtenerAlumnos, crearAlumno };
