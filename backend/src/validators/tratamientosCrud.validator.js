const { body, param } = require('express-validator');

exports.validateTratamientoBody = [
  body('descripcion').notEmpty().withMessage('Descripción obligatoria'),
  body('costo').isFloat({ gt: 0 }).withMessage('Costo debe ser mayor que cero'),
];

exports.validateTratamientoId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
];
