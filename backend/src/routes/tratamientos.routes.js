const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const tratamientosController = require('../controllers/tratamientos.controller');
const {
  validateDescripcion,
  validateMascotaId,
  validateCitaId,
} = require('../validators/tratamientos.validator');

// Middleware general para validar errores
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Buscar citas donde se aplicó un tratamiento
router.get('/buscar-citas-tratamiento/:descripcion', validateDescripcion, validarCampos, tratamientosController.buscarCitasPorTratamiento);

// Top 5 tratamientos más aplicados
router.get('/top-tratamientos', tratamientosController.tratamientosMasAplicados);

// Historial de tratamientos de una mascota
router.get('/historial-mascota/:mascotaId', validateMascotaId, validarCampos, tratamientosController.historialTratamientosMascota);

// Tratamientos aplicados en una cita
router.get('/aplicados-cita/:citaId', validateCitaId, validarCampos, tratamientosController.tratamientosAplicadosEnCita);

// Listar todos los tratamientos disponibles
router.get('/disponibles', tratamientosController.listarTratamientosDisponibles);

module.exports = router;
