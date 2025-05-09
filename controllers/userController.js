const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los usuarios',
        error: error.message
      });
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No se encontró ningún usuario con ID ${userId}`
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el usuario',
        error: error.message
      });
    }
  },

  // Crear un nuevo usuario
  createUser: async (req, res) => {
    try {
      const { name, email, date_Birth, password } = req.body;
      
      // Validaciones básicas
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son campos requeridos'
        });
      }
      
      // Verificar si ya existe un usuario con ese email
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un usuario con ese email'
        });
      }
      
      // Encriptar contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Crear usuario
      const userData = {
        name,
        email,
        password: hashedPassword,
        date_Birth: date_Birth || null,
        created_at: new Date().toISOString()
      };
      
      const newUser = await User.create(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el usuario',
        error: error.message
      });
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      let { name, email, date_Birth, password } = req.body;
      
      // Verificar si el usuario existe
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: `No se encontró ningún usuario con ID ${userId}`
        });
      }
      
      // Preparar datos para actualizar
      const updateData = {};
      
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (date_Birth) updateData.date_Birth = date_Birth;
      
      // Si se proporciona contraseña, encriptarla
      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }
      
      // Actualizar usuario
      const updatedUser = await User.update(userId, updateData);
      
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el usuario',
        error: error.message
      });
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Intentar eliminar el usuario
      const deleted = await User.delete(userId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `No se encontró ningún usuario con ID ${userId}`
        });
      }
      
      res.json({
        success: true,
        message: `Usuario con ID ${userId} eliminado correctamente`
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el usuario',
        error: error.message
      });
    }
  },

  // Buscar usuarios por nombre
  searchUsers: async (req, res) => {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere un término de búsqueda'
        });
      }
      
      const users = await User.searchByName(name);
      
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar usuarios',
        error: error.message
      });
    }
  }
};

module.exports = userController;