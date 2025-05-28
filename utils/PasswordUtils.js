/**
 * Utilidades para encriptar y desencriptar contraseñas
 */

const bcrypt = require('bcrypt');

const PasswordUtils = {
  /**
   * Encriptar contraseña
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<string>} - Contraseña encriptada
   */
  async encrypt(password) {
    try {
      const saltRounds = 12; // Nivel de seguridad (10-12 es recomendado)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error al encriptar contraseña:', error);
      throw new Error('Error en el proceso de encriptación');
    }
  },

  /**
   * Verificar contraseña (comparar texto plano con encriptada)
   * @param {string} plainPassword - Contraseña en texto plano
   * @param {string} hashedPassword - Contraseña encriptada
   * @returns {Promise<boolean>} - true si coinciden, false si no
   */
  async verify(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      throw new Error('Error en el proceso de verificación');
    }
  },

  /**
   * Validar fortaleza de contraseña
   * @param {string} password - Contraseña a validar
   * @returns {Object} - Objeto con resultado de validación
   */
  validateStrength(password) {
    const result = {
      isValid: true,
      errors: []
    };

    // Mínimo 8 caracteres
    if (password.length < 8) {
      result.isValid = false;
      result.errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push('La contraseña debe tener al menos una letra mayúscula');
    }

    // Al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      result.isValid = false;
      result.errors.push('La contraseña debe tener al menos una letra minúscula');
    }

    // Al menos un número
    if (!/\d/.test(password)) {
      result.isValid = false;
      result.errors.push('La contraseña debe tener al menos un número');
    }

    // Al menos un carácter especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.isValid = false;
      result.errors.push('La contraseña debe tener al menos un carácter especial');
    }

    return result;
  }
};

module.exports = PasswordUtils;