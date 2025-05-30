const express = require('express');
const router = express.Router();
const userController = require('../controllers/songController');

// GET /songs - Listar todas las canciones
router.get('/user/:email', userController.getUserLikedSongs);

// GET /songs / - Canciones populares que un usuario no ha escuchado y pertenecen a los géneros escucha.
router.get('/recommendations/popular/:email', userController.getPopularRecommendations);

// GET /users/  - Usuarios con gustos similares
router.get('/recommendations/similar/:email', userController.getFriendsRecommendations);

module.exports = router;