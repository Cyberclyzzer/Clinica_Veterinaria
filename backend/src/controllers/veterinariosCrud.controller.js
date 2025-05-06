const pool = require('../db/index');

// Crear nuevo veterinario
exports.crearVeterinario = async (req, res) => {
  const { nombre, especialidad, telefono_contacto, horario_atencion, usuario_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO veterinarios (nombre, especialidad, telefono_contacto, horario_atencion, usuario_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, especialidad, telefono_contacto, horario_atencion, usuario_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear veterinario' });
  }
};

// Actualizar veterinario
exports.actualizarVeterinario = async (req, res) => {
  const { id } = req.params;
  const { nombre, especialidad, telefono_contacto } = req.body;
  try {
    const result = await pool.query(`
      UPDATE veterinarios
      SET nombre = $1, especialidad = $2, telefono_contacto = $3
      WHERE id = $4
      RETURNING *
    `, [nombre, especialidad, telefono_contacto, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Veterinario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar veterinario' });
  }
};

// Eliminar veterinario
exports.eliminarVeterinario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM veterinarios
      WHERE id = $1
      RETURNING *
    `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Veterinario no encontrado' });
    }
    res.json({ message: 'Veterinario eliminado', veterinario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar veterinario' });
  }
};
