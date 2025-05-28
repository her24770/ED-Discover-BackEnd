const express = require('express');
const router = express.Router();
const userController = require('../controllers/songController');

// GET /songs - Listar todas las canciones
router.get('/user/:email', userController.getUserLikedSongs);


module.exports = router;