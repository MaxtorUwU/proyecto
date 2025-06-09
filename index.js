const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/db');

const asignaturasRoutes = require('./routes/asignaturas');
const alumnosRoutes = require('./routes/alumnos');
const authRoutes = require('./routes/authRoutes');
const inscripcionesRoutes = require('./routes/inscripciones');
const profesoresRoutes = require('./routes/profesores');
const bloquesRoutes = require('./routes/bloques');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Usar rutas montadas
app.use('/asignaturas', asignaturasRoutes);
app.use('/alumnos', alumnosRoutes);
app.use('/auth', authRoutes);
app.use('/inscripciones', inscripcionesRoutes);
app.use('/profesores', profesoresRoutes);
app.use('/bloques', bloquesRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



