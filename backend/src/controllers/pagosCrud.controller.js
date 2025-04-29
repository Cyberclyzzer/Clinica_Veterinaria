const pool = require('../db/index');

// Crear nuevo pago
exports.crearPago = async (req, res) => {
  const { cita_id, monto_total, fecha_pago, metodo_pago, estado_pago } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO pagos (cita_id, monto_total, fecha_pago, metodo_pago, estado_pago)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [cita_id, monto_total, fecha_pago, metodo_pago, estado_pago]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el pago' });
  }
};

// Actualizar pago existente
exports.actualizarPago = async (req, res) => {
  const { id } = req.params;
  const { cita_id, monto_total, fecha_pago, metodo_pago, estado_pago } = req.body;
  try {
    const result = await pool.query(`
      UPDATE pagos
      SET cita_id = $1, monto_total = $2, fecha_pago = $3, metodo_pago = $4, estado_pago = $5
      WHERE id = $6
      RETURNING *
    `, [cita_id, monto_total, fecha_pago, metodo_pago, estado_pago, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el pago' });
  }
};

// Eliminar pago
exports.eliminarPago = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM pagos
      WHERE id = $1
      RETURNING *
    `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago eliminado', pago: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el pago' });
  }
};
