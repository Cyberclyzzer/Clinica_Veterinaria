const pool = require('../db/index');

// Listar todas las citas programadas para hoy
exports.listarCitasHoy = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, m.nombre AS mascota, p.nombre AS propietario, v.nombre AS veterinario, c.motivo
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE DATE(c.fecha_hora) = CURRENT_DATE
      ORDER BY c.fecha_hora
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando citas de hoy' });
  }
};

// Listar próximas citas de un veterinario
exports.listarCitasVeterinario = async (req, res) => {
  const { veterinarioId } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, m.nombre AS mascota, p.nombre AS propietario, c.motivo
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE c.veterinario_id = $1
      AND c.fecha_hora >= CURRENT_TIMESTAMP
      ORDER BY c.fecha_hora
    `, [veterinarioId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando citas del veterinario' });
  }
};

// Detalles de una cita específica
exports.detallesCita = async (req, res) => {
  const { citaId } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, c.motivo, c.notas_veterinario,
             m.nombre AS mascota, m.especie, m.raza,
             p.nombre AS propietario, p.telefono AS telefono_propietario,
             v.nombre AS veterinario, v.especialidad AS especialidad_veterinario
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE c.id = $1
    `, [citaId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo detalles de la cita' });
  }
};

// Historial de citas de una mascota específica
exports.historialCitasMascota = async (req, res) => {
  const { mascotaId } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, v.nombre AS veterinario, c.motivo, c.notas_veterinario
      FROM citas c
      JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE c.mascota_id = $1
      ORDER BY c.fecha_hora DESC
    `, [mascotaId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo historial de citas' });
  }
};
