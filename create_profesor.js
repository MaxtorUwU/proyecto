const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const crearProfesor = async () => {
  const password = 'claveSecreta123';
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO profesor (nombre, username, password_hash, email, departamento, rut)
     VALUES ('Carlos Rojas', 'carlos.r', $1, 'carlos@ejemplo.com', 'Ciencias', 12345678)`,
    [hash]
  );

  console.log('✅ Profesor creado con contraseña hasheada');
  pool.end();
};

crearProfesor();
