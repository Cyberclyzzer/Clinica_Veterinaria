const app = require('./src/app');
const crearTablas = require('./src/db/setup');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await crearTablas(); // 👈🏻 Esto crea las tablas al iniciar
});
