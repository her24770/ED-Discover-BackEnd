// Middleware para validar datos de usuario

// Validar datos al crear un usuario
const validateUserCreate = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];
  
    // Validar nombre
    if (!name) {
      errors.push('El nombre es requerido');
    } else if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
  
    // Validar email
    if (!email) {
      errors.push('El email es requerido');
    } else if (!isValidEmail(email)) {
      errors.push('El formato de email no es válido');
    }
  
    // Validar contraseña
    if (!password) {
      errors.push('La contraseña es requerida');
    } else if (typeof password !== 'string' || password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
  
    // Validar fecha de nacimiento (si se proporciona)
    if (req.body.date_Birth && !isValidDate(req.body.date_Birth)) {
      errors.push('La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)');
    }
  
    // Si hay errores, devolver respuesta con errores
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
  
    // Si todo está bien, continuar
    next();
  };
  
  // Validar datos al actualizar un usuario
  const validateUserUpdate = (req, res, next) => {
    const { name, email, password, date_Birth } = req.body;
    const errors = [];
  
    // Validar que haya al menos un campo para actualizar
    if (!name && !email && !password && !date_Birth) {
      errors.push('Debe proporcionar al menos un campo para actualizar');
    }
  
    // Validar nombre (si se proporciona)
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
    }
  
    // Validar email (si se proporciona)
    if (email !== undefined) {
      if (!isValidEmail(email)) {
        errors.push('El formato de email no es válido');
      }
    }
  
    // Validar contraseña (si se proporciona)
    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }
    }
  
    // Validar fecha de nacimiento (si se proporciona)
    if (date_Birth !== undefined && !isValidDate(date_Birth)) {
      errors.push('La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)');
    }
  
    // Si hay errores, devolver respuesta con errores
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
  
    // Si todo está bien, continuar
    next();
  };
  
  // Función auxiliar para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Función auxiliar para validar fecha
  function isValidDate(dateString) {
    if (!dateString) return false;
    
    // Si es un objeto de fecha Neo4j
    if (typeof dateString === 'object' && dateString.year) {
      return true;
    }
    
    // Si es una cadena, verificar formato YYYY-MM-DD
    if (typeof dateString === 'string') {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(dateString)) return false;
      
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }
    
    return false;
  }
  
  module.exports = {
    validateUserCreate,
    validateUserUpdate
  };