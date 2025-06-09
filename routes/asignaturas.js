const express = require('express');
const router = express.Router();
const { obtenerAsignaturas } = require('../controllers/asignaturasController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, obtenerAsignaturas);

module.exports = router;
