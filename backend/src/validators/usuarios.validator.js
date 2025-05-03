const { body } = require('express-validator');

exports.signupValidator = [
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  body('rol_id').isIn([1, 2, 3, 4]).withMessage('Rol inválido'),
  body('estado').optional().isBoolean().withMessage('Estado debe ser booleano')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];
