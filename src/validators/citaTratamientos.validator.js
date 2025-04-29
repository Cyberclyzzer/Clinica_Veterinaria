const { body, param } = require('express-validator');

exports.validateInsert = [
  body('cita_id').isInt({ gt: 0 }),
  body('tratamiento_id').isInt({ gt: 0 }),
  body('cantidad').isInt({ gt: 0 }),
  body('costo_aplicado').isFloat({ gt: 0 }),
];

exports.validateUpdateOrDeleteParams = [
  param('cita_id').isInt({ gt: 0 }),
  param('tratamiento_id').isInt({ gt: 0 }),
];

exports.validateUpdateBody = [
  body('cantidad').isInt({ gt: 0 }),
  body('costo_aplicado').isFloat({ gt: 0 }),
];
