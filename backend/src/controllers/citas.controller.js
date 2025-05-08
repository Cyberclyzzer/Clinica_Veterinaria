const pool = require('../db/index');

// Obtener todas las citas
exports.listarCitas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, m.nombre AS mascota, p.nombre AS propietario, v.nombre AS veterinario
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      JOIN veterinarios v ON c.veterinario_id = v.id
      ORDER BY c.fecha_hora
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
}

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

exports.listarCitasPorFecha = async (req, res) => {
  const { fecha } = req.params; // fecha en formato YYYY-MM-DD
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, m.nombre AS mascota, p.nombre AS propietario, v.nombre AS veterinario, c.motivo
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE DATE(c.fecha_hora) = $1
      ORDER BY c.fecha_hora
    ` , [fecha]);
    // Verificar si se encontraron citas para la fecha especificada
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontraron citas para la fecha especificada' });
    }
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

exports.obtenerCitasPorPropietario = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'El ID de usuario debe ser un número' });
    }

    // Verificar que el propietario existe
    const propietarioResult = await pool.query(
      'SELECT id FROM propietarios WHERE usuario_id = $1',
      [userId]
    );

    const propietarioId = propietarioResult.rows[0]?.id;

    if (propietarioResult.rowCount === 0) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }

    // Obtener las citas de las mascotas de ese propietario
    const citasResult = await pool.query(`
      SELECT 
        c.id AS cita_id,
        m.nombre AS nombre_mascota,
        c.fecha_hora,
        c.motivo,
        v.nombre AS veterinario_nombre
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE m.propietario_id = $1
      ORDER BY c.fecha_hora DESC;
    `, [propietarioId]);

    return res.json(citasResult.rows);

  } catch (error) {
    console.error('❌ Error al obtener las citas del propietario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// Listar citas programadas para un veterinario en una fecha específica
exports.listarCitasVeterinarioHoy = async (req, res) => {
  const { veterinarioId, fecha } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.id AS id_cita, c.fecha_hora, c.mascota_id, c.veterinario_id, c.duracion_estimada, m.nombre AS mascota, p.nombre AS propietario, c.motivo
      FROM citas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE c.veterinario_id = $1
      AND DATE(c.fecha_hora) = $2
      ORDER BY c.fecha_hora
    `, [veterinarioId, fecha]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando citas del veterinario' });
  }
};
