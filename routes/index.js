const express = require('express');
const router = express.Router();

// Importar rutas específicas
const userRoutes = require('./userRoutes');
const songRoutes = require('./songRoutes'); 

// Configurar rutas
router.use('/users', userRoutes);
router.use('/songs', songRoutes); 

// Ruta de prueba para la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Neo4j funcionando correctamente',
    endpoints: {
      users: '/api/users',
      songs: '/api/songs'
    }
  });
});

module.exports = router;