/**
 * @file app.js
 * @description Manejo de servidor Http y conexioncon base de  datos
 */

//importar dependencias
const app = require('./app');
const { testConnection, closeDriver } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
const server = app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await testConnection();
});

// Manejo de cierre del servidor
process.on('SIGINT', () => process.exit(0));

// Capturar señales de cierre
process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);