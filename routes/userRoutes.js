const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users/email/:email - Buscar usuario por email
router.get('/email/:email', userController.getUserByEmail);

// GET /users/email/:email/friends - Listar amigos de un usuario
router.get('/friends/:email', userController.getUserFriends);

// POST /users - Crear un nuevo usuario
router.post('/register', userController.createUser);

// POST /users/login - Login de usuario
router.post('/login', userController.loginUser);

// POST /users/top 5 generos
router.get('/topgender/:email', userController.getTopGenresByUserEmail);

// POST /users/top 5 artistas
router.get('/topartists/:email', userController.getTopArtistsByUserEmail);

// POST /users/top 5 emotions
router.get('/topemotions/:email', userController.getTopEmotionsByUserEmail);

// POST /users/top 5 albums
router.get('/topalbums/:email', userController.getTopAlbumsByUserEmail);


module.exports = router;