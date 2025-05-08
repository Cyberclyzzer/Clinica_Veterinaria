const pool = require('../db');

exports.listarRecepcionistas = async (req, res) => {
    const result = await pool.query('SELECT id, nombre, telefono_contacto, direccion, usuario_id FROM recepcionistas');
    res.json(result.rows);
};

exports.obtenerRecepcionista = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT id, nombre, telefono_contacto, direccion, usuario_id FROM recepcionistas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Recepcionista no encontrado' });
    res.json(result.rows[0]);
};

exports.crearRecepcionista = async (req, res) => {
    try {
      const { nombre, telefono_contacto, direccion, usuario_id } = req.body;
  
      const result = await pool.query(
        'INSERT INTO recepcionistas (nombre, telefono_contacto, direccion, usuario_id) VALUES ($1, $2, $3, $4) RETURNING id, nombre, telefono_contacto, direccion, usuario_id',
        [nombre, telefono_contacto, direccion, usuario_id]
      );
  
      res.status(201).json({
        message: 'Recepcionista creado exitosamente',
        recepcionista: result.rows[0]
      });
    } catch (error) {
      console.error(error);
      if (error.code === '23505') { // duplicate key
        return res.status(409).json({ error: 'El recepcionista ya está registrado' });
      }
      res.status(500).json({ error: 'Error al crear recepcionista' });
    }
};

exports.ObtenerPorIdUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  if (!usuario_id) {
    return res.status(400).json({ message: 'El usuario_id es requerido' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM recepcionistas WHERE usuario_id = $1',
      [usuario_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recepcionista no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener Recepcionista' });
  }
};