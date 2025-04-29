const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/citasCrud.controller');
const {
  validateCitaBody,
  validateCitaId
} = require('../validators/citasCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear nueva cita
router.post('/', validateCitaBody, validarCampos, controller.crearCita);

// Actualizar cita
router.put('/:id', [...validateCitaId, ...validateCitaBody], validarCampos, controller.actualizarCita);

// Eliminar cita
router.delete('/:id', validateCitaId, validarCampos, controller.eliminarCita);

module.exports = router;
