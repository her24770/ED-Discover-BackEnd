const express = require('express');
const router = express.Router();

// Importar rutas específicas
const userRoutes = require('./userRoutes');

// Configurar rutas
router.use('/users', userRoutes);

// Ruta de prueba para la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Neo4j funcionando correctamente',
    endpoints: {
      users: '/api/users'
    }
  });
});

module.exports = router;