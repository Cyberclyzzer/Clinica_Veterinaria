const { body } = require('express-validator');

exports.postValidator = [
    body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    body('telefono_contacto').notEmpty().withMessage('El teléfono es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria')
  ];

  