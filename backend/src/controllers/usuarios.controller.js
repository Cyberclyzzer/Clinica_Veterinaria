const pool = require('../db');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
  const { username, email, password, rol_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (username, email, password, rol_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, rol_id, creado_en`,
      [username, email, hashedPassword, rol_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};


exports.iniciarSesion = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await pool.query(`SELECT * FROM usuarios WHERE username = $1`, [username]);
      if (result.rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      const usuario = result.rows[0];
      const passwordValida = await bcrypt.compare(password, usuario.password);
  
      if (!passwordValida) return res.status(401).json({ message: 'Contraseña incorrecta' });
  
      // Aquí podrías crear una sesión o solo devolver datos básicos
      res.json({
        message: 'Login exitoso',
        id: usuario.id,
        username: usuario.username,
        rol_id: usuario.rol_id
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  };


  exports.listarUsuarios = async (req, res) => {
    try {
      const result = await pool.query(`SELECT id, username, email, rol_id, creado_en FROM usuarios`);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: 'Error al listar usuarios' });
    }
  };


  exports.obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(`SELECT id, username, email, rol_id, creado_en FROM usuarios WHERE id = $1`, [id]);
      if (result.rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error al buscar usuario' });
    }
  };


  exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, rol_id } = req.body;
  
    try {
      let hashedPassword = null;
      if (password) hashedPassword = await bcrypt.hash(password, 10);
  
      await pool.query(`
        UPDATE usuarios
        SET username = $1,
            email = $2,
            password = COALESCE($3, password),
            rol_id = $4
        WHERE id = $5
      `, [username, email, hashedPassword, rol_id, id]);
  
      res.json({ message: 'Usuario actualizado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar usuario' });
    }
  };

  
  exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id]);
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar usuario' });
    }
  };
  