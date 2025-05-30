/**
 * Controlador para manejar las operaciones de usuarios
 * Todo junto: lógica de BD + lógica de HTTP
 */

const { getSession } = require('../config/db'); // Ajusta la ruta según tu estructura
const PasswordUtils = require('../utils/passwordUtils'); // Ajusta la ruta según tu estructura


const UserController = {
  /**
   * Buscar usuario por email
   * GET /users/email/:email
   */
  async getUserByEmail(req, res) {
    const session = getSession();
    
    try {
      const { email } = req.params;
      
      // Validar que el email esté presente
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'El email es requerido'
        });
      }
      
      // Query a Neo4j
      const query = `
        MATCH (u:User)
        WHERE u.email = $email
        RETURN u
      `;
      
      const result = await session.run(query, { email });
      
      // Verificar si se encontró el usuario
      if (result.records.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      // Extraer las propiedades del nodo User
      const userNode = result.records[0].get('u');
      const userData = userNode.properties;
      
      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Usuario encontrado',
        data: userData
      });
      
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    } finally {
      await session.close();
    }
  },


  /**
   * Listar amigos de un usuario por email
   * GET /users/email/:email/friends
   */
  async getUserFriends(req, res) {
    const session = getSession();
    
    try {
      const { email } = req.params;
      
      // Validar que el email esté presente
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'El email es requerido'
        });
      }
      
      // Query a Neo4j para obtener amigos
      const query = `
        MATCH (u:User)-[:friends]-(friend:User)
        WHERE u.email = $email
        RETURN friend
      `;
      
      const result = await session.run(query, { email });
      
      // Verificar si se encontraron amigos
      if (result.records.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron amigos para este usuario o el usuario no existe'
        });
      }
      
      // Extraer todos los datos de los amigos
      const friends = result.records.map(record => {
        const friendNode = record.get('friend');
        return friendNode.properties;
      });
      
      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Amigos encontrados',
        data: friends,
        count: friends.length
      });
      
    } catch (error) {
      console.error('Error al buscar amigos del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    } finally {
      await session.close();
    }
  },

  /**
   * Crear un nuevo usuario
   * POST /users
   */
  async createUser(req, res) {
    const session = getSession();
    
    try {
      const { name, email, date_Birth, password } = req.body;
      
      // Validar que todos los campos requeridos estén presentes
      if (!name || !email || !date_Birth || !password) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos: name, email, date_Birth, password'
        });
      }
      
      // Validar fortaleza de la contraseña (opcional)
      const passwordValidation = PasswordUtils.validateStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors
        });
      }
      
      // Encriptar la contraseña
      const encryptedPassword = await PasswordUtils.encrypt(password);
      
      // Verificar si el usuario ya existe
      const checkQuery = `
        MATCH (u:User)
        WHERE u.email = $email
        RETURN u
      `;
      
      const existingUser = await session.run(checkQuery, { email });
      
      if (existingUser.records.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un usuario con este email'
        });
      }
      
      // Query para crear el nuevo usuario
      const createQuery = `
        CREATE (u:User { 
          name: $name, 
          email: $email, 
          date_Birth: date($date_Birth), 
          password: $password 
        })
        RETURN u
      `;
      
      const result = await session.run(createQuery, {
        name,
        email,
        date_Birth,
        password: encryptedPassword // Usar la contraseña encriptada
      });
      
      // Extraer los datos del usuario creado (sin mostrar la contraseña)
      const userNode = result.records[0].get('u');
      const createdUser = { ...userNode.properties };
      
      // Remover la contraseña de la respuesta por seguridad
      delete createdUser.password;
      
      // Respuesta exitosa
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: createdUser
      });
      
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    } finally {
      await session.close();
    }
  },


   /**
   * Login de usuario
   * POST /users/login
   */
  async loginUser(req, res) {
    const session = getSession();
    
    try {
      const { email, password } = req.body;
      
      // Validar que los campos estén presentes
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }
      
      // Buscar usuario por email
      const query = `
        MATCH (u:User)
        WHERE u.email = $email
        RETURN u
      `;
      
      const result = await session.run(query, { email });
      
      // Verificar si el usuario existe
      if (result.records.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Obtener datos del usuario
      const userNode = result.records[0].get('u');
      const userData = userNode.properties;
      
      // Verificar la contraseña
      const isPasswordValid = await PasswordUtils.verify(password, userData.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Login exitoso - remover contraseña de la respuesta
      const userResponse = { ...userData };
      delete userResponse.password;
      
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: userResponse
      });
      
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    } finally {
      await session.close();
    }
  },


  /**
 * Obtener los 5 géneros más escuchados por un usuario
 * GET /users/:email/top-genres
 */
async getTopGenresByUserEmail(req, res) {
  const session = getSession();

  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const query = `
      MATCH (u:User {email: $email})-[l:like]->(g:Gender)
      RETURN g.name AS genre, g.description AS description, l.strength AS strength
      ORDER BY l.strength DESC
      LIMIT 5
    `;

    const result = await session.run(query, { email });

    const genres = result.records.map(record => ({
      genre: record.get('genre'),
      description: record.get('description'),
      strength: record.get('strength').toInt?.() ?? record.get('strength') // por si strength es un Integer de neo4j
    }));

    res.status(200).json({
      success: true,
      message: 'Géneros más escuchados obtenidos correctamente',
      data: genres
    });

  } catch (error) {
    console.error('Error al obtener los géneros más escuchados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  } finally {
    await session.close();
  }
},


/**
 * Obtener los 5 artistas más seguidos por un usuario según la fuerza del follow
 * GET /api/users/topartists/:email
 */
async getTopArtistsByUserEmail(req, res) {
  const session = getSession();
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'El email es requerido' });
    }

    const query = `
      MATCH (u:User { email: $email })-[f:follow]->(a:Artist)
      RETURN a, f.strength AS strength
      ORDER BY strength DESC
      LIMIT 5
    `;

    const result = await session.run(query, { email });

    const topArtists = result.records.map(record => {
      const artist = record.get('a').properties;
      artist.strength = record.get('strength').toInt();
      return artist;
    });

    res.status(200).json({
      success: true,
      message: 'Top 5 artistas por usuario',
      data: topArtists
    });
  } catch (error) {
    console.error('Error al obtener top artistas:', error);
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  } finally {
    await session.close();
  }
},



/**
 * Obtener las 5 emociones más sentidas por un usuario
 * GET /api/users/topemotions/:email
 */
async getTopEmotionsByUserEmail(req, res) {
  const session = getSession();
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'El email es requerido' });
    }

    const query = `
      MATCH (u:User { email: $email })-[f:feeling]->(e:Emotion)
      RETURN e, f.strength AS strength
      ORDER BY strength DESC
      LIMIT 5
    `;

    const result = await session.run(query, { email });

    const topEmotions = result.records.map(record => {
      const emotion = record.get('e').properties;
      emotion.strength = record.get('strength').toInt();
      return emotion;
    });

    res.status(200).json({
      success: true,
      message: 'Top 5 emociones por usuario',
      data: topEmotions
    });
  } catch (error) {
    console.error('Error al obtener emociones:', error);
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  } finally {
    await session.close();
  }
},



/**
 * Obtener los 5 álbumes más escuchados por un usuario, basado en canciones escuchadas
 * GET /api/users/topalbums/:email
 */
async getTopAlbumsByUserEmail(req, res) {
  const session = getSession();
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'El email es requerido' });
    }

    const query = `
      MATCH (u:User { email: $email })-[f:like]->(e:Album)
      RETURN e, f.strength AS strength
      ORDER BY strength DESC
      LIMIT 5
    `;

    const result = await session.run(query, { email });

    const topEmotions = result.records.map(record => {
      const emotion = record.get('e').properties;
      emotion.strength = record.get('strength').toInt();
      return emotion;
    });

    res.status(200).json({
      success: true,
      message: 'Top 5 emociones por usuario',
      data: topEmotions
    });
  } catch (error) {
    console.error('Error al obtener emociones:', error);
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  } finally {
    await session.close();
  }
},


/**
 * Incrementar el peso de una relación :listen entre un usuario y una canción
 * POST /api/users/song-weight
 */
async updateSongWeight(req, res) {
  const session = getSession();
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'El email y el nombre de la canción son requeridos' });
    }

    const query = `
      MATCH (u:User { email: $email })-[r:listen]->(s:Song { name: $name })
      SET r.strength = coalesce(r.strength, 0) + 1
      RETURN r
    `;

    const result = await session.run(query, { email, name });

    if (result.records.length === 0) {
      return res.status(404).json({ success: false, message: 'Relación listen no encontrada entre usuario y canción' });
    }

    const relation = result.records[0].get('r').properties;

    res.status(200).json({
      success: true,
      message: 'Peso de la canción actualizado',
      data: relation
    });
  } catch (error) {
    console.error('Error al actualizar el peso de la canción:', error);
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  } finally {
    await session.close();
  }
},








};

module.exports = UserController;