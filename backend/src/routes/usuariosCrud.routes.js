const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/usuariosCrud.controller');
const {
  validateUsuarioBody,
  validateUsuarioId,
  validateUsuarioEmailParam
} = require('../validators/usuariosCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear
router.post('/', validateUsuarioBody, validarCampos, controller.crearUsuario);

// Listar todos
router.get('/', controller.listarUsuarios);

// Buscar por ID
router.get('/:id', validateUsuarioId, validarCampos, controller.obtenerUsuarioPorId);

// Buscar por email
router.get('/buscar/email/:email', validateUsuarioEmailParam, validarCampos, controller.obtenerUsuarioPorEmail);

// Actualizar
router.put('/:id', [...validateUsuarioId, ...validateUsuarioBody], validarCampos, controller.actualizarUsuario);

// Eliminar
router.delete('/:id', validateUsuarioId, validarCampos, controller.eliminarUsuario);

module.exports = router;
