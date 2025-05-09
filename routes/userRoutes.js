const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserCreate, validateUserUpdate } = require('../middleware/userMiddleware');

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para buscar usuarios por nombre
router.get('/search', userController.searchUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Ruta para crear un nuevo usuario
router.post('/', validateUserCreate, userController.createUser);

// Ruta para actualizar un usuario
router.put('/:id', validateUserUpdate, userController.updateUser);

// Ruta para eliminar un usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;