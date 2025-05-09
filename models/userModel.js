const { getSession } = require('../config/db');

const User = {
  // Encontrar todos los usuarios
  findAll: async () => {
    const session = getSession();
    try {
      const result = await session.run('MATCH (u:User) RETURN u ORDER BY u.name');
      const users = result.records.map(record => {
        const user = record.get('u');
        return {
          id: user.identity.toNumber(),
          ...formatUserProperties(user.properties)
        };
      });
      return users;
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  },

  // Encontrar un usuario por ID
  findById: async (id) => {
    const session = getSession();
    try {
      const result = await session.run(
        'MATCH (u:User) WHERE id(u) = $id RETURN u',
        { id: parseInt(id) }
      );

      if (result.records.length === 0) {
        return null;
      }

      const user = result.records[0].get('u');
      return {
        id: user.identity.toNumber(),
        ...formatUserProperties(user.properties)
      };
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  },

  // Encontrar un usuario por email
  findByEmail: async (email) => {
    const session = getSession();
    try {
      const result = await session.run(
        'MATCH (u:User) WHERE u.email = $email RETURN u',
        { email }
      );

      if (result.records.length === 0) {
        return null;
      }

      const user = result.records[0].get('u');
      return {
        id: user.identity.toNumber(),
        ...formatUserProperties(user.properties)
      };
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  },

  // Crear un nuevo usuario
  create: async (userData) => {
    const session = getSession();
    try {
      // Formatear fecha de nacimiento si existe
      if (userData.date_Birth) {
        userData.date_Birth = formatDate(userData.date_Birth);
      }

      const result = await session.run(
        'CREATE (u:User $userData) RETURN u',
        { userData }
      );

      const user = result.records[0].get('u');
      return {
        id: user.identity.toNumber(),
        ...formatUserProperties(user.properties)
      };
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  },

  // Actualizar un usuario existente
  update: async (id, userData) => {
    const session = getSession();
    try {
      // Formatear fecha de nacimiento si existe
      if (userData.date_Birth) {
        userData.date_Birth = formatDate(userData.date_Birth);
      }

      const result = await session.run(
        'MATCH (u:User) WHERE id(u) = $id SET u += $userData RETURN u',
        { id: parseInt(id), userData }
      );

      if (result.records.length === 0) {
        return null;
      }

      const user = result.records[0].get('u');
      return {
        id: user.identity.toNumber(),
        ...formatUserProperties(user.properties)
      };
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  },

  // Eliminar un usuario
  delete: async (id) => {
    const session = getSession();
    try {
      // Verificar primero si el usuario existe
      const checkResult = await session.run(
        'MATCH (u:User) WHERE id(u) = $id RETURN u',
        { id: parseInt(id) }
      );

      if (checkResult.records.length === 0) {
        return false;
      }

      // Eliminar el usuario
      await session.run(
        'MATCH (u:User) WHERE id(u) = $id DETACH DELETE u',
        { id: parseInt(id) }
      );

      return true;
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  },

  // Buscar usuarios por nombre
  searchByName: async (searchTerm) => {
    const session = getSession();
    try {
      const result = await session.run(
        'MATCH (u:User) WHERE u.name CONTAINS $searchTerm RETURN u ORDER BY u.name',
        { searchTerm }
      );

      const users = result.records.map(record => {
        const user = record.get('u');
        return {
          id: user.identity.toNumber(),
          ...formatUserProperties(user.properties)
        };
      });
      
      return users;
    } catch (error) {
      throw error;
    } finally {
      await session.close();
    }
  }
};

// Función auxiliar para formatear las propiedades del usuario
function formatUserProperties(properties) {
  const formattedProps = { ...properties };
  
  // Formatear la fecha de nacimiento si existe
  if (formattedProps.date_Birth && formattedProps.date_Birth.year) {
    // Si es un objeto de fecha de Neo4j, convertirlo a formato string YYYY-MM-DD
    formattedProps.date_Birth = `${formattedProps.date_Birth.year}-${String(formattedProps.date_Birth.month).padStart(2, '0')}-${String(formattedProps.date_Birth.day).padStart(2, '0')}`;
  }
  
  // Eliminar la contraseña para no exponerla en las respuestas
  delete formattedProps.password;
  
  return formattedProps;
}

// Función auxiliar para formatear fechas
function formatDate(dateString) {
  if (!dateString) return null;
  
  // Si ya es un objeto de fecha Neo4j, devolverlo tal cual
  if (dateString.year) return dateString;
  
  try {
    // Si es una cadena en formato YYYY-MM-DD
    if (typeof dateString === 'string') {
      const [year, month, day] = dateString.split('-').map(Number);
      return { year, month, day };
    }
    return null;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return null;
  }
}

module.exports = User;