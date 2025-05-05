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

exports.obtenerCitasUsuario = async (req, res) => {
  try {
    const userId = req.userId; // asumimos que un middleware ya lo puso

    // buscar al propietario vinculado al usuario
    const propietarioResult = await pool.query(
      'SELECT id FROM propietarios WHERE usuario_id = $1',
      [userId]
    );

    if (propietarioResult.rowCount === 0) {
      return res.status(404).json({ message: 'No tienes mascotas registradas' });
    }

    const propietarioId = propietarioResult.rows[0].id;

    // buscar las citas de las mascotas del propietario
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
      ORDER BY c.fecha_hora DESC
    `, [propietarioId]);

    return res.json(citasResult.rows);
  } catch (error) {
    console.error('Error al obtener citas del usuario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
