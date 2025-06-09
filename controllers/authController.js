const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan username o password' });
  }

  try {
    // Buscar en alumno primero
    const alumno = await pool.query(
      'SELECT * FROM alumno WHERE username = $1',
      [username]
    );

    const usuario = alumno.rows[0];

    // Si no es alumno, buscar en profesor
    if (!usuario) {
      const profesor = await pool.query(
        'SELECT * FROM profesor WHERE username = $1',
        [username]
      );
      usuario = profesor.rows[0];
    }

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id_alumno || usuario.id_profesor, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { login };
