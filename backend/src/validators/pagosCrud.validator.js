const { body, param } = require('express-validator');

exports.validatePagoBody = [
  body('cita_id').isInt({ gt: 0 }).withMessage('ID de cita inválido'),
  body('monto_total').isFloat({ gt: 0 }).withMessage('Monto debe ser mayor que 0'),
  body('fecha_pago').isISO8601().withMessage('Fecha inválida'),
  body('metodo_pago').notEmpty().withMessage('Método de pago requerido'),
  body('estado_pago').notEmpty().withMessage('Estado de pago requerido')
];

exports.validatePagoId = [
  param('id').isInt({ gt: 0 }).withMessage('ID inválido')
];
