/**
 * @file app.js
 * @description Archivo principal de la aplicación, configuracion inicial de proyecto
 */

// Importar dependencias
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar rutas
const routes = require('./routes');

// Inicializar la aplicación
const app = express();

// uso Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de etiquetas
app.use('/api', routes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

//exportar a otros archivos
module.exports = app;