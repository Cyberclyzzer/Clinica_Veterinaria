const pool = require('../db');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { email, password, rol_id, propietario_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (email, password, rol_id, propietario_id) VALUES ($1, $2, $3, $4) RETURNING id, email, rol_id, estado, fecha_creacion, propietario_id',
      [email, hashedPassword, rol_id, propietario_id]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // duplicate key
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    if (!user.estado) {
      return res.status(403).json({ error: 'Usuario deshabilitado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({
      message: 'Login exitoso',
      usuario: { id: user.id, email: user.email, rol_id: user.rol_id }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.listarUsuarios = async (req, res) => {
  const result = await pool.query('SELECT id, email, rol_id, estado, fecha_creacion FROM usuarios');
  res.json(result.rows);
};

exports.obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT id, email, rol_id, estado, fecha_creacion FROM usuarios WHERE id = $1', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(result.rows[0]);
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, password, rol_id, estado } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    'UPDATE usuarios SET email = $1, password = $2, rol_id = $3, estado = $4 WHERE id = $5',
    [email, hashedPassword, rol_id, estado, id]
  );

  res.json({ message: 'Usuario actualizado' });
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  res.json({ message: 'Usuario eliminado' });
};
