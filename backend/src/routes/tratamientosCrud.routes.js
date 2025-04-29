const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/tratamientosCrud.controller');
const {
  validateTratamientoBody,
  validateTratamientoId,
} = require('../validators/tratamientosCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear tratamiento
router.post('/', validateTratamientoBody, validarCampos, controller.crearTratamiento);

// Actualizar tratamiento
router.put('/:id', [...validateTratamientoId, ...validateTratamientoBody], validarCampos, controller.actualizarTratamiento);

// Eliminar tratamiento
router.delete('/:id', validateTratamientoId, validarCampos, controller.eliminarTratamiento);

module.exports = router;
