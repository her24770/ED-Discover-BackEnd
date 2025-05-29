const express = require('express');
const router = express.Router();
const userController = require('../controllers/songController');

// GET /songs - Listar todas las canciones
router.get('/user/:email', userController.getUserLikedSongs);

// GET /songs / - Canciones populares que un usuario no ha escuchado y pertenecen a los géneros escucha.
router.get('/recommendations/popular/:email', userController.getPopularRecommendations);

module.exports = router;