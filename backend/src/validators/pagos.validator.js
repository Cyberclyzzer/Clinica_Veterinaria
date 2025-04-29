const { param } = require('express-validator');

exports.validateCitaId = [
  param('citaId')
    .isInt({ gt: 0 })
    .withMessage('El ID de la cita debe ser un número entero positivo.'),
];

exports.validateFecha = [
  param('fecha')
    .isISO8601()
    .withMessage('La fecha debe tener el formato YYYY-MM-DD.'),
];
