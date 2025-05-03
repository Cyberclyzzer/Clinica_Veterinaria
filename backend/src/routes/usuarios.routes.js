const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

const {
  validarRegistro,
  validarLogin,
  validarActualizar,
  validarObtenerPorId,
  validarEliminar
} = require('../validators/usuarios.validator');

const validarCampos = require('../middleware/usuario.middleware');

// Registro
router.post('/signup', validarRegistro, validarCampos, usuariosController.registrarUsuario);

// Login
router.post('/login', validarLogin, validarCampos, usuariosController.iniciarSesion);

// Listar
router.get('/', usuariosController.listarUsuarios);

// Obtener por id
router.get('/:id', validarObtenerPorId, validarCampos, usuariosController.obtenerUsuarioPorId);

// Actualizar
router.put('/:id', validarActualizar, validarCampos, usuariosController.actualizarUsuario);

// Eliminar
router.delete('/:id', validarEliminar, validarCampos, usuariosController.eliminarUsuario);

module.exports = router;
