const pool = require('../db/index');

// Buscar citas donde se aplicó un tratamiento específico
exports.buscarCitasPorTratamiento = async (req, res) => {
  const { descripcion } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, m.nombre AS mascota, p.nombre AS propietario
      FROM citas c
      JOIN cita_tratamientos ct ON c.id = ct.cita_id
      JOIN tratamientos t ON ct.tratamiento_id = t.id
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE t.descripcion ILIKE $1
    `, [`%${descripcion}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error buscando citas por tratamiento' });
  }
};

// Top 5 tratamientos más aplicados
exports.tratamientosMasAplicados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.descripcion, COUNT(ct.tratamiento_id) AS veces_aplicado
      FROM cita_tratamientos ct
      JOIN tratamientos t ON ct.tratamiento_id = t.id
      GROUP BY t.id, t.descripcion
      ORDER BY veces_aplicado DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo tratamientos más aplicados' });
  }
};

// Historial de tratamientos de una mascota
exports.historialTratamientosMascota = async (req, res) => {
  const { mascotaId } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.fecha_hora, t.descripcion AS tratamiento, ct.costo_aplicado, v.nombre AS veterinario
      FROM citas c
      JOIN cita_tratamientos ct ON c.id = ct.cita_id
      JOIN tratamientos t ON ct.tratamiento_id = t.id
      JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE c.mascota_id = $1
      ORDER BY c.fecha_hora DESC
    `, [mascotaId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo historial de tratamientos' });
  }
};

// Listar tratamientos aplicados en una cita específica
exports.tratamientosAplicadosEnCita = async (req, res) => {
  const { citaId } = req.params;
  try {
    const result = await pool.query(`
      SELECT t.descripcion AS tratamiento, ct.cantidad, ct.costo_aplicado
      FROM cita_tratamientos ct
      JOIN tratamientos t ON ct.tratamiento_id = t.id
      WHERE ct.cita_id = $1
    `, [citaId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando tratamientos de la cita' });
  }
};

// Listar todos los tratamientos disponibles
exports.listarTratamientosDisponibles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, descripcion, costo
      FROM tratamientos
      ORDER BY descripcion
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando tratamientos disponibles' });
  }
};
