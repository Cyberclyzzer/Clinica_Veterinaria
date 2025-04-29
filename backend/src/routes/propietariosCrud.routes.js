const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/propietariosCrud.controller');
const {
  validatePropietarioBody,
  validatePropietarioId,
} = require('../validators/propietariosCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear propietario
router.post('/', validatePropietarioBody, validarCampos, controller.crearPropietario);

// Actualizar propietario
router.put('/:id', [...validatePropietarioId, ...validatePropietarioBody], validarCampos, controller.actualizarPropietario);

// Eliminar propietario
router.delete('/:id', validatePropietarioId, validarCampos, controller.eliminarPropietario);

module.exports = router;
