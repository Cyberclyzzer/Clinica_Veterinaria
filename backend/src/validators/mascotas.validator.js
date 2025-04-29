const { param } = require('express-validator');

exports.validateEdadAnios = [
  param('anios')
    .isInt({ gt: 0 })
    .withMessage('El número de años debe ser un entero positivo.'),
];

exports.validatePropietarioId = [
  param('propietarioId')
    .isInt({ gt: 0 })
    .withMessage('El ID del propietario debe ser un entero positivo.'),
];

exports.validateNombre = [
  param('nombre')
    .notEmpty()
    .withMessage('El nombre no puede estar vacío.'),
];
