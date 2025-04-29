const pool = require('../db/index');

// Crear nueva cita
exports.crearCita = async (req, res) => {
  const { mascota_id, veterinario_id, fecha_hora, motivo, notas_veterinario } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO citas (mascota_id, veterinario_id, fecha_hora, motivo, notas_veterinario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [mascota_id, veterinario_id, fecha_hora, motivo, notas_veterinario]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la cita' });
  }
};

// Actualizar cita existente
exports.actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { mascota_id, veterinario_id, fecha_hora, motivo, notas_veterinario } = req.body;
  try {
    const result = await pool.query(`
      UPDATE citas
      SET mascota_id = $1, veterinario_id = $2, fecha_hora = $3, motivo = $4, notas_veterinario = $5
      WHERE id = $6
      RETURNING *
    `, [mascota_id, veterinario_id, fecha_hora, motivo, notas_veterinario, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
};

// Eliminar cita
exports.eliminarCita = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM citas WHERE id = $1 RETURNING *
    `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    res.json({ message: 'Cita eliminada', cita: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la cita' });
  }
};
