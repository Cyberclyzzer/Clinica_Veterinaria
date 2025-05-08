const pool = require('../db/index');

// Listar todos los veterinarios y sus especialidades
exports.listarVeterinarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, especialidad, telefono_contacto, horario_atencion
      FROM veterinarios
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando veterinarios' });
  }
};

// Obtener veterinario por ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT id, nombre, especialidad, telefono_contacto, horario_atencion
      FROM veterinarios
      WHERE id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Veterinario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo veterinario por ID' });
  }
};

// Contar cuántas citas ha atendido cada veterinario
exports.contarCitasPorVeterinario = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.nombre, v.especialidad, COUNT(c.id) AS numero_citas
      FROM veterinarios v
      LEFT JOIN citas c ON v.id = c.veterinario_id
      GROUP BY v.id, v.nombre, v.especialidad
      ORDER BY numero_citas DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error contando citas por veterinario' });
  }
};

exports.getByUserId = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT *
      FROM veterinarios
      WHERE usuario_id = $1
    `, [usuario_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Veterinario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo veterinario por ID de usuario' });
  }
};
