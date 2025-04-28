const pool = require('../db/index');

// Contar cuántas mascotas hay de cada especie
exports.cantidadMascotasPorEspecie = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT especie, COUNT(*) AS cantidad
      FROM mascotas
      GROUP BY especie
      ORDER BY cantidad DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error contando mascotas por especie' });
  }
};

// Listar mascotas mayores de X años
exports.listarMascotasMayoresEdad = async (req, res) => {
  const { anios } = req.params;
  try {
    const result = await pool.query(`
      SELECT m.nombre, m.especie, m.raza, m.fecha_nacimiento,
             AGE(CURRENT_DATE, m.fecha_nacimiento) AS edad_actual,
             p.nombre AS propietario
      FROM mascotas m
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE m.fecha_nacimiento IS NOT NULL
      AND AGE(CURRENT_DATE, m.fecha_nacimiento) >= INTERVAL '${anios} years'
      ORDER BY m.fecha_nacimiento
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando mascotas mayores' });
  }
};

// Listar mascotas de un propietario específico
exports.listarMascotasDePropietario = async (req, res) => {
  const { propietarioId } = req.params;
  try {
    const result = await pool.query(`
      SELECT m.id, m.nombre, m.especie, m.raza, m.fecha_nacimiento
      FROM mascotas m
      WHERE m.propietario_id = $1
    `, [propietarioId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listando mascotas del propietario' });
  }
};

// Buscar mascota por nombre y traer datos del dueño
exports.buscarMascotaPorNombre = async (req, res) => {
  const { nombre } = req.params;
  try {
    const result = await pool.query(`
      SELECT m.id AS id_mascota, m.nombre AS nombre_mascota, m.especie, m.raza,
             p.id AS id_propietario, p.nombre AS nombre_propietario, p.telefono
      FROM mascotas m
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE m.nombre ILIKE $1
    `, [`%${nombre}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error buscando mascota' });
  }
};

// Buscar propietario por nombre
exports.buscarPropietarioPorNombre = async (req, res) => {
  const { nombre } = req.params;
  try {
    const result = await pool.query(`
      SELECT id, nombre, telefono, email, direccion
      FROM propietarios
      WHERE nombre ILIKE $1
    `, [`%${nombre}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error buscando propietario' });
  }
};
