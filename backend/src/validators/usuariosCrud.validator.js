const { body, param } = require('express-validator');

exports.validateUsuarioBody = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres')
];

exports.validateUsuarioId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido')
];

exports.validateUsuarioEmailParam = [
  param('email').notEmpty().withMessage('El email no puede estar vacío')
];
