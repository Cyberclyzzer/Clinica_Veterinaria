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

  const { nombre, telefono, email, direccion } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO propietarios (nombre, telefono, email, direccion) VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, telefono, email, direccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear propietario' });
  }
};
