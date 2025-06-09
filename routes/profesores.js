const express = require('express');
const router = express.Router();
const { loginProfesor } = require('../controllers/profesoresController');

router.post('/login', loginProfesor);

module.exports = router;
