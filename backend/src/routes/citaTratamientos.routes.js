const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/citaTratamientos.controller');
const {
  validateInsert,
  validateUpdateOrDeleteParams,
  validateUpdateBody
} = require('../validators/citaTratamientos.validator');

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Crear
router.post('/', validateInsert, validarCampos, controller.agregarTratamientoACita);

// Actualizar
router.put(
  '/:cita_id/:tratamiento_id',
  [...validateUpdateOrDeleteParams, ...validateUpdateBody],
  validarCampos,
  controller.actualizarTratamientoCita
);

// Eliminar
router.delete(
  '/:cita_id/:tratamiento_id',
  validateUpdateOrDeleteParams,
  validarCampos,
  controller.eliminarTratamientoCita
);

module.exports = router;
