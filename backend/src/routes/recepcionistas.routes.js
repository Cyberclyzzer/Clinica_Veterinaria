const express = require('express');
const router = express.Router();
const recepcionistasController = require('../controllers/recepcionistas.controller');
const postValidator = require('../validators/recepcionistas.validator');

router.get('/', postValidator.recepcionistasController.listarRecepcionistas);

router.get('/:id', recepcionistasController.obtenerRecepcionista);

router.post('/', recepcionistasController.crearRecepcionista);

module.exports = router;