const pool = require('../db/index');
const { validationResult } = require('express-validator');

exports.getAllPropietarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM propietarios');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener propietarios' });
  }
};

exports.createPropietario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, telefono, email, direccion, usuario_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO propietarios (nombre, telefono, email, direccion, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, telefono, email, direccion, usuario_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear propietario' });
  }
};

exports.getByUserId = async (req, res) => {
  const { usuario_id } = req.params;
  if (!usuario_id) {
    return res.status(400).json({ message: 'El usuario_id es requerido' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM propietarios WHERE usuario_id = $1',
      [usuario_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener propietario' });
  }
};
