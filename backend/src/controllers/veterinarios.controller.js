const pool = require('../db/index');

// Listar todos los veterinarios y sus especialidades
exports.listarVeterinarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, especialidad, telefono_contacto
      FROM veterinarios
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando veterinarios' });
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
