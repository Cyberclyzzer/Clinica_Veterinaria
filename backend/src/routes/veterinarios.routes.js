const express = require('express');
const router = express.Router();
const veterinariosController = require('../controllers/veterinarios.controller');

// Listar todos los veterinarios
router.get('/', veterinariosController.listarVeterinarios);

// Contar número de citas atendidas por cada veterinario
router.get('/citas-atendidas', veterinariosController.contarCitasPorVeterinario);

// Obtener veterinario por ID de usuario
router.get('/:usuario_id', veterinariosController.getByUserId);

module.exports = router;
