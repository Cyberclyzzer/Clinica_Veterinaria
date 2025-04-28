const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
const propietariosRoutes = require('./routes/propietarios.routes');
const citasRoutes = require('./routes/citas.routes');
const mascotasRoutes = require('./routes/mascotas.routes');
const pagosRoutes = require('./routes/pagos.routes');
const tratamientosRoutes = require('./routes/tratamientos.routes');
const veterinariosRoutes = require('./routes/veterinarios.routes');


// Registrar rutas
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/tratamientos', tratamientosRoutes);
app.use('/api/veterinarios', veterinariosRoutes);

module.exports = app;
