const pool = require('../db/index');

// Crear nuevo propietario
exports.crearPropietario = async (req, res) => {
  const { nombre, telefono, email, direccion, usuario_id } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO propietarios (nombre, telefono, email, direccion, usuario_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, telefono, email, direccion, usuario_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el propietario' });
  }
};

// Actualizar propietario
exports.actualizarPropietario = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, direccion } = req.body;
  try {
    const result = await pool.query(`
      UPDATE propietarios
      SET nombre = $1, telefono = $2, email = $3, direccion = $4
      WHERE id = $5
      RETURNING *
    `, [nombre, telefono, email, direccion, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar propietario' });
  }
};

// Eliminar propietario
exports.eliminarPropietario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM propietarios
      WHERE id = $1
      RETURNING *
    `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }
    res.json({ message: 'Propietario eliminado', propietario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar propietario' });
  }
};
