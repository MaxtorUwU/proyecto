const express = require('express');
const router = express.Router();
const { obtenerAlumnos, crearAlumno } = require('../controllers/alumnosController');

router.get('/', obtenerAlumnos);
router.post('/', crearAlumno);

module.exports = router;
