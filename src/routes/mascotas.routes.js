const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const mascotasController = require('../controllers/mascotas.controller');
const {
  validateEdadAnios,
  validatePropietarioId,
  validateNombre,
} = require('../validators/mascotas.validator');

// Middleware para validar errores
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Contar mascotas por especie
router.get('/especies', mascotasController.cantidadMascotasPorEspecie);

// Listar mascotas mayores de X años
router.get('/mayores/:anios', validateEdadAnios, validarCampos, mascotasController.listarMascotasMayoresEdad);

// Listar mascotas de un propietario
router.get('/propietario/:propietarioId', validatePropietarioId, validarCampos, mascotasController.listarMascotasDePropietario);

// Buscar mascota por nombre
router.get('/buscar-mascota/:nombre', validateNombre, validarCampos, mascotasController.buscarMascotaPorNombre);

// Buscar propietario por nombre
router.get('/buscar-propietario/:nombre', validateNombre, validarCampos, mascotasController.buscarPropietarioPorNombre);

module.exports = router;
