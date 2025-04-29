const { body, param } = require('express-validator');

exports.validateMascotaBody = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('especie').notEmpty().withMessage('La especie es obligatoria'),
  body('raza').notEmpty().withMessage('La raza es obligatoria'),
  body('fecha_nacimiento').isISO8601().withMessage('Fecha de nacimiento inválida'),
  body('propietario_id').isInt({ gt: 0 }).withMessage('ID de propietario inválido'),
];

exports.validateMascotaId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido'),
];
