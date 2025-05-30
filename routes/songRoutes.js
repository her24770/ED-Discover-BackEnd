const express = require('express');
const router = express.Router();
const userController = require('../controllers/songController');

// GET /songs - Listar todas las canciones
router.get('/user/:email', userController.getUserLikedSongs);

// GET /songs / - Canciones populares que un usuario no ha escuchado y pertenecen a los géneros escucha.
router.get('/recommendations/popular/:email', userController.getPopularRecommendations);

// GET /users/  - Usuarios con gustos similares a un usuario
router.get('/recommendations/similar/:email', userController.getFriendsRecommendations);

// GET /songs/ - Recomendacion de canciones basadas en generos
router.get('/recommendations/genres/:email', userController.getRecommendationByGenre);

// GET /songs/ - Recomendacion de canciones basadas en años
router.get('/recommendations/years/:email', userController.getRecommendationByYear);

// GET /songs/ - Recomendacion de canciones basadas emociones
router.get('/recommendations/emotions/:email', userController.getRecommendationByEmotion);

module.exports = router;