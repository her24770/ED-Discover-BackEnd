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
  
  // Probar conexión a Neo4j
  await testConnection();
});

// Manejo de cierre del servidor
const handleShutdown = async () => {
  console.log('Cerrando servidor...');
  
  // Cerrar conexión de Neo4j
  await closeDriver();
  
  // Cerrar servidor HTTP
  server.close(() => {
    console.log('Servidor HTTP cerrado');
    process.exit(0);
  });
  
  // Si el servidor no se cierra en 5 segundos, forzar cierre
  setTimeout(() => {
    console.log('Forzando cierre del proceso');
    process.exit(1);
  }, 5000);
};

// Capturar señales de cierre
process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);