const { body, param } = require('express-validator');

exports.validatePropietarioBody = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('telefono').notEmpty().withMessage('Teléfono es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('direccion').notEmpty().withMessage('Dirección obligatoria'),
];

exports.validatePropietarioId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
];
