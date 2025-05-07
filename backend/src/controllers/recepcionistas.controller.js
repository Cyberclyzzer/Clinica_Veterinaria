const pool = require('../db');

exports.listarRecepcionistas = async (req, res) => {
    const result = await pool.query('SELECT id, nombre, email, telefono_contacto, direccion, usuario_id FROM recepcionistas');
    res.json(result.rows);
};

exports.obtenerRecepcionista = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT id, nombre, email, telefono_contacto, direccion, usuario_id FROM recepcionistas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Recepcionista no encontrado' });
    res.json(result.rows[0]);
};

exports.crearRecepcionista = async (req, res) => {
    try {
      const { nombre, email, telefono_contacto, direccion, usuario_id } = req.body;
  
      const result = await pool.query(
        'INSERT INTO recepcionistas (nombre, email, telefono_contacto, direccion, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, telefono_contacto, direccion, usuario_id',
        [nombre, email, telefono_contacto, direccion, usuario_id]
      );
  
      res.status(201).json({
        message: 'Recepcionista creado exitosamente',
        recepcionista: result.rows[0]
      });
    } catch (error) {
      console.error(error);
      if (error.code === '23505') { // duplicate key
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
      res.status(500).json({ error: 'Error al crear recepcionista' });
    }
};