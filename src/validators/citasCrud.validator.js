const { body, param } = require('express-validator');

exports.validateCitaBody = [
  body('mascota_id').isInt({ gt: 0 }),
  body('veterinario_id').isInt({ gt: 0 }),
  body('fecha_hora').isISO8601().withMessage('Fecha y hora inválidas'),
  body('motivo').notEmpty().withMessage('El motivo es obligatorio'),
  body('notas_veterinario').optional().isString()
];

exports.validateCitaId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido')
];
