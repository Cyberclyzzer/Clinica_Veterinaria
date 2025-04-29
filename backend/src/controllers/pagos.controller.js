const pool = require('../db/index');

// Calcular el costo de una cita basado en tratamientos
exports.calcularCostoCita = async (req, res) => {
  const { citaId } = req.params;
  try {
    const result = await pool.query(`
      SELECT ct.cita_id, SUM(ct.costo_aplicado * ct.cantidad) AS costo_calculado
      FROM cita_tratamientos ct
      WHERE ct.cita_id = $1
      GROUP BY ct.cita_id
    `, [citaId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error calculando el costo de la cita' });
  }
};

// Calcular el ingreso total de un día
exports.calcularIngresoDia = async (req, res) => {
  const { fecha } = req.params;
  try {
    const result = await pool.query(`
      SELECT SUM(monto_total) AS ingreso_total_dia
      FROM pagos
      WHERE DATE(fecha_pago) = $1
      AND estado_pago = 'Pagado'
    `, [fecha]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error calculando ingreso del día' });
  }
};

// Listar todas las citas con pagos pendientes
exports.listarCitasPagoPendiente = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, m.nombre AS mascota, p.nombre AS propietario, pg.monto_total
      FROM pagos pg
      JOIN citas c ON pg.cita_id = c.id
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE pg.estado_pago = 'Pendiente'
      ORDER BY c.fecha_hora
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando citas con pagos pendientes' });
  }
};

// Verificar pago de una cita específica
exports.verificarPagoCita = async (req, res) => {
  const { citaId } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.id AS id_pago, p.monto_total, p.fecha_pago, p.metodo_pago, p.estado_pago, c.fecha_hora AS fecha_cita
      FROM pagos p
      JOIN citas c ON p.cita_id = c.id
      WHERE p.cita_id = $1
    `, [citaId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verificando el pago de la cita' });
  }
};
