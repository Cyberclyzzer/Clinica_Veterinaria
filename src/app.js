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
const citaTratamientosRoutes = require('./routes/citaTratamientos.routes');
const citasCrudRoutes = require('./routes/citasCrud.routes');
const pagosCrudRoutes = require('./routes/pagosCrud.routes');
const propietariosCrudRoutes = require('./routes/propietariosCrud.routes');
const tratamientosCrudRoutes = require('./routes/tratamientosCrud.routes');
const veterinariosCrudRoutes = require('./routes/veterinariosCrud.routes');
const mascotasCrudRoutes = require('./routes/mascotasCrud.routes');


// Registrar rutas
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/tratamientos', tratamientosRoutes);
app.use('/api/veterinarios', veterinariosRoutes);
app.use('/api/cita-tratamientos', citaTratamientosRoutes);
app.use('/api/citas', citasCrudRoutes);
app.use('/api/pagos-crud', pagosCrudRoutes);
app.use('/api/propietarios-crud', propietariosCrudRoutes);
app.use('/api/tratamientos-crud', tratamientosCrudRoutes);
app.use('/api/veterinarios-crud', veterinariosCrudRoutes);
app.use('/api/mascotas-crud', mascotasCrudRoutes);

module.exports = app;
