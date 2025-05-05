const pool = require('./index'); // tu conexión a PostgreSQL

const crearTablas = async () => {
  try {
    await pool.query(`

      -- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol_id INTEGER NOT NULL CHECK (rol_id IN (1,2,3,4)),
  estado BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      -- Crear tabla propietarios
CREATE TABLE IF NOT EXISTS propietarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear tabla veterinarios
CREATE TABLE IF NOT EXISTS veterinarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  especialidad VARCHAR(50),
  telefono_contacto VARCHAR(100),
  horario_atencion VARCHAR(20),
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear tabla mascotas
CREATE TABLE IF NOT EXISTS mascotas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  especie VARCHAR(50),
  raza VARCHAR(50),
  fecha_nacimiento DATE,
  propietario_id INTEGER REFERENCES propietarios(id) ON DELETE CASCADE
);

-- Crear tabla tratamientos
CREATE TABLE IF NOT EXISTS tratamientos (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  costo NUMERIC(10,2) NOT NULL
);

-- Crear tabla citas
CREATE TABLE IF NOT EXISTS citas (
  id SERIAL PRIMARY KEY,
  mascota_id INTEGER REFERENCES mascotas(id) ON DELETE CASCADE,
  veterinario_id INTEGER REFERENCES veterinarios(id) ON DELETE CASCADE,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  motivo TEXT,
  notas_veterinario TEXT
);

-- Crear tabla cita_tratamientos
CREATE TABLE IF NOT EXISTS cita_tratamientos (
  id SERIAL PRIMARY KEY,
  cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
  tratamiento_id INTEGER REFERENCES tratamientos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL,
  costo_aplicado NUMERIC(10,2) NOT NULL
);

-- Crear tabla pagos
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  cita_id INTEGER REFERENCES citas(id) ON DELETE CASCADE,
  monto_total NUMERIC(10,2) NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  metodo_pago VARCHAR(50),
  estado_pago VARCHAR(20)
);


    `);

    console.log('✅ Tablas creadas correctamente');
  } catch (error) {
    console.error('❌ Error creando las tablas:', error);
  }
};

module.exports = crearTablas;
