const { body } = require('express-validator');

exports.validatePropietario = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefono').optional().isString(),
  body('direccion').optional().isString(),
];
