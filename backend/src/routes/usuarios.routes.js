const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { signupValidator, loginValidator } = require('../validators/usuarios.validator');
const validationHandler = require('../middleware/usuario.middleware');

router.post('/signup', signupValidator, validationHandler, usuariosController.signup);
router.post('/login', loginValidator, validationHandler, usuariosController.login);
router.get('/', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.obtenerUsuario);
router.put('/:id', signupValidator, validationHandler, usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;
