const { body, param } = require('express-validator');

exports.validateVeterinarioBody = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('especialidad').notEmpty().withMessage('Especialidad es obligatoria'),
  body('telefono_contacto').notEmpty().withMessage('Teléfono de contacto es obligatorio'),
];

exports.validateVeterinarioId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
];
