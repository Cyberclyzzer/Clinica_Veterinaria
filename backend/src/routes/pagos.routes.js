const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const pagosController = require('../controllers/pagos.controller');
const { validateCitaId, validateFecha } = require('../validators/pagos.validator');

// Middleware para validar errores
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Calcular costo de cita
router.get('/costo-cita/:citaId', validateCitaId, validarCampos, pagosController.calcularCostoCita);

// Calcular ingreso de un día
router.get('/ingreso-dia/:fecha', validateFecha, validarCampos, pagosController.calcularIngresoDia);

// Listar citas con pagos pendientes
router.get('/pendientes', pagosController.listarCitasPagoPendiente);

// Verificar pago de cita específica
router.get('/verificar-pago/:citaId', validateCitaId, validarCampos, pagosController.verificarPagoCita);

module.exports = router;
