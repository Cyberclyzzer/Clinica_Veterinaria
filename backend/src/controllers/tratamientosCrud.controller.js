const pool = require('../db/index');

// Crear nuevo tratamiento
exports.crearTratamiento = async (req, res) => {
  const { descripcion, costo } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO tratamientos (descripcion, costo)
      VALUES ($1, $2)
      RETURNING *
    `, [descripcion, costo]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear tratamiento' });
  }
};

// Actualizar tratamiento
exports.actualizarTratamiento = async (req, res) => {
  const { id } = req.params;
  const { descripcion, costo } = req.body;
  try {
    const result = await pool.query(`
      UPDATE tratamientos
      SET descripcion = $1, costo = $2
      WHERE id = $3
      RETURNING *
    `, [descripcion, costo, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tratamiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar tratamiento' });
  }
};

// Eliminar tratamiento
exports.eliminarTratamiento = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM tratamientos
      WHERE id = $1
      RETURNING *
    `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tratamiento no encontrado' });
    }
    res.json({ message: 'Tratamiento eliminado', tratamiento: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar tratamiento' });
  }
};
