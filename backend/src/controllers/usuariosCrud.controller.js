const pool = require('../db/index');
const bcrypt = require('bcrypt');   // Importamos bcrypt para comparar las contraseñas

// Crear usuario
exports.crearUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *`,
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Listar todos los usuarios
exports.listarUsuarios = async (_req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM usuarios ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

// Buscar por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar usuario por ID' });
  }
};

// Buscar por email
exports.obtenerUsuarioPorEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM usuarios WHERE email ILIKE $1`, [`%${email}%`]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar usuario por email' });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `UPDATE usuarios SET email = $1, password = $2 WHERE id = $3 RETURNING *`,
      [email, password, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM usuarios WHERE id = $1 RETURNING *`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado', usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// --- Función que maneja la lógica del login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email en la base de datos
    const result = await pool.query(
      'SELECT id, email, password FROM usuarios WHERE email = $1',
      [email]
    );

    // Si el usuario no existe
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0]; // Obtenemos el primer usuario

    // Verificamos que la contraseña ingresada coincida con la almacenada (bcrypt.compare)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Si las credenciales son válidas, retornamos un mensaje de éxito
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
