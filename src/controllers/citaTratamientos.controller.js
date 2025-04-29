const pool = require('../db/index');

// Agregar tratamiento a una cita
exports.agregarTratamientoACita = async (req, res) => {
  const { cita_id, tratamiento_id, cantidad, costo_aplicado } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO cita_tratamientos (cita_id, tratamiento_id, cantidad, costo_aplicado)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [cita_id, tratamiento_id, cantidad, costo_aplicado]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar tratamiento a la cita' });
  }
};

// Actualizar tratamiento aplicado en una cita
exports.actualizarTratamientoCita = async (req, res) => {
  const { cita_id, tratamiento_id } = req.params;
  const { cantidad, costo_aplicado } = req.body;
  try {
    const result = await pool.query(`
      UPDATE cita_tratamientos
      SET cantidad = $1, costo_aplicado = $2
      WHERE cita_id = $3 AND tratamiento_id = $4
      RETURNING *
    `, [cantidad, costo_aplicado, cita_id, tratamiento_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tratamiento no encontrado para la cita' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar tratamiento de la cita' });
  }
};

// Eliminar tratamiento aplicado en una cita
exports.eliminarTratamientoCita = async (req, res) => {
  const { cita_id, tratamiento_id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM cita_tratamientos
      WHERE cita_id = $1 AND tratamiento_id = $2
      RETURNING *
    `, [cita_id, tratamiento_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontró el tratamiento para eliminar' });
    }
    res.json({ message: 'Tratamiento eliminado', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar tratamiento de la cita' });
  }
};
