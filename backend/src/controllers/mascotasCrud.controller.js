const pool = require('../db/index');

// Crear nueva mascota
exports.crearMascota = async (req, res) => {
  const { nombre, especie, raza, fecha_nacimiento, propietario_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, propietario_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, especie, raza, fecha_nacimiento, propietario_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la mascota' });
  }
};

// Obtener mascota por ID
exports.obtenerMascota = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM mascotas WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener la mascota' });
  }
};

// Listar todas las mascotas
exports.listarMascotas = async (_req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM mascotas ORDER BY nombre`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar mascotas' });
  }
};

// Actualizar mascota
exports.actualizarMascota = async (req, res) => {
  const { id } = req.params;
  const { nombre, especie, raza, fecha_nacimiento, propietario_id } = req.body;
  try {
    const result = await pool.query(`
      UPDATE mascotas
      SET nombre = $1, especie = $2, raza = $3, fecha_nacimiento = $4, propietario_id = $5
      WHERE id = $6
      RETURNING *
    `, [nombre, especie, raza, fecha_nacimiento, propietario_id, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la mascota' });
  }
};

// Eliminar mascota
exports.eliminarMascota = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM mascotas WHERE id = $1 RETURNING *`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    res.json({ message: 'Mascota eliminada', mascota: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar la mascota' });
  }
};
