const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/veterinariosCrud.controller');
const {
  validateVeterinarioBody,
  validateVeterinarioId,
} = require('../validators/veterinariosCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear veterinario
router.post('/', validateVeterinarioBody, validarCampos, controller.crearVeterinario);

// Actualizar veterinario
router.put('/:id', [...validateVeterinarioId, ...validateVeterinarioBody], validarCampos, controller.actualizarVeterinario);

// Eliminar veterinario
router.delete('/:id', validateVeterinarioId, validarCampos, controller.eliminarVeterinario);

module.exports = router;
