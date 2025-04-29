const { param } = require('express-validator');

exports.validateDescripcion = [
  param('descripcion')
    .notEmpty()
    .withMessage('La descripción del tratamiento es obligatoria.'),
];

exports.validateMascotaId = [
  param('mascotaId')
    .isInt({ gt: 0 })
    .withMessage('El ID de la mascota debe ser un número entero positivo.'),
];

exports.validateCitaId = [
  param('citaId')
    .isInt({ gt: 0 })
    .withMessage('El ID de la cita debe ser un número entero positivo.'),
];
