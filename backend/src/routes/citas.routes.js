const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const {
  validateVeterinarioId,
  validateCitaId,
  validateMascotaId,
} = require('../validators/citas.validator');

// Middleware general para validar errores
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Endpoint para obtener citas de un propietario
router.get('/propietario/:propietarioId', citasController.obtenerCitasPorPropietario);

// Listar citas de hoy
router.get('/hoy', citasController.listarCitasHoy);

// Listar citas próximas de un veterinario
router.get('/veterinario/:veterinarioId', validateVeterinarioId, validarCampos, citasController.listarCitasVeterinario);

// Ver detalles de una cita específica
router.get('/detalle/:citaId', validateCitaId, validarCampos, citasController.detallesCita);

// Ver historial de citas de una mascota
router.get('/historial/:mascotaId', validateMascotaId, validarCampos, citasController.historialCitasMascota);

module.exports = router;
