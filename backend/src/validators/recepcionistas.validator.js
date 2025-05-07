const { body } = require('express-validator');

exports.postValidator = [
    body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    body('email').notEmpty.isEmail().withMessage('El email no es válido'),
    body('telefono_contacto').notEmpty().withMessage('El teléfono es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  ];

  