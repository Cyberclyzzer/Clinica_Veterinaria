const { body, param } = require('express-validator');

const validarRegistro = [
  body('username')
    .notEmpty().withMessage('El username es obligatorio')
    .isLength({ min: 3 }).withMessage('El username debe tener al menos 3 caracteres'),
  body('email')
    .isEmail().withMessage('El email no es válido'),
  body('password')
    .isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
  body('rol_id')
    .isIn([1, 2, 3, 4]).withMessage('El rol_id debe ser 1, 2, 3 o 4')
];

const validarLogin = [
  body('username')
    .notEmpty().withMessage('El username es obligatorio'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

const validarActualizar = [
  param('id')
    .isInt().withMessage('El id debe ser un número entero'),
  body('username')
    .notEmpty().withMessage('El username es obligatorio'),
  body('email')
    .isEmail().withMessage('El email no es válido'),
  body('rol_id')
    .isIn([1, 2, 3, 4]).withMessage('El rol_id debe ser 1, 2, 3 o 4'),
  body('password')
    .optional() // solo si envían password nueva
    .isLength({ min: 4 }).withMessage('La nueva contraseña debe tener al menos 4 caracteres')
];

const validarObtenerPorId = [
  param('id')
    .isInt().withMessage('El id debe ser un número entero')
];

const validarEliminar = [
  param('id')
    .isInt().withMessage('El id debe ser un número entero')
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarActualizar,
  validarObtenerPorId,
  validarEliminar
};
