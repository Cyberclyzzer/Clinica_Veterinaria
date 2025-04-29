const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/pagosCrud.controller');
const { validatePagoBody, validatePagoId } = require('../validators/pagosCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear nuevo pago
router.post('/', validatePagoBody, validarCampos, controller.crearPago);

// Actualizar pago
router.put('/:id', [...validatePagoId, ...validatePagoBody], validarCampos, controller.actualizarPago);

// Eliminar pago
router.delete('/:id', validatePagoId, validarCampos, controller.eliminarPago);

module.exports = router;
