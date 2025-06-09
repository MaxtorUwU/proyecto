const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginProfesor = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM profesor WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const profesor = result.rows[0];
    const valido = await bcrypt.compare(password, profesor.password_hash);

    if (!valido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: profesor.id_profesor, username: profesor.username, rol: 'profesor' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Error al loguear profesor:', err);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};

module.exports = { loginProfesor };
