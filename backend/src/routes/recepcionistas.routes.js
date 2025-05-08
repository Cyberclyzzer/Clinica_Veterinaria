const express = require('express');
const router = express.Router();
const recepcionistasController = require('../controllers/recepcionistas.controller');
const { postValidator } = require('../validators/recepcionistas.validator');

router.get('/', recepcionistasController.listarRecepcionistas);

router.get('/:id', recepcionistasController.obtenerRecepcionista);

router.post('/', postValidator, recepcionistasController.crearRecepcionista);

router.get('/usuario/:usuario_id', recepcionistasController.ObtenerPorIdUsuario);

module.exports = router;