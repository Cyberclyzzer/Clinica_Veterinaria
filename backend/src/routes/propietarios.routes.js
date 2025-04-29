const express = require('express');
const router = express.Router();

const propietariosController = require('../controllers/propietarios.controller');
const { validatePropietario } = require('../validators/propietarios.validator');

// Listar todos
router.get('/', propietariosController.getAllPropietarios);

// Crear nuevo
router.post('/', validatePropietario, propietariosController.createPropietario);

module.exports = router;
