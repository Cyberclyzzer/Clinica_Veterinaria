const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const controller = require('../controllers/mascotasCrud.controller');
const { validateMascotaBody, validateMascotaId } = require('../validators/mascotasCrud.validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }
  next();
};

// Crear
router.post('/', validateMascotaBody, validarCampos, controller.crearMascota);

// Obtener una
router.get('/:id', validateMascotaId, validarCampos, controller.obtenerMascota);

// Listar todas
router.get('/', controller.listarMascotas);

// Actualizar
router.put('/:id', [...validateMascotaId, ...validateMascotaBody], validarCampos, controller.actualizarMascota);

// Eliminar
router.delete('/:id', validateMascotaId, validarCampos, controller.eliminarMascota);

module.exports = router;
