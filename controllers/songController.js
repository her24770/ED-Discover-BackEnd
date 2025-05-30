/**
 * Controlador para manejar las operaciones de canciones
 * Todo junto: lógica de BD + lógica de HTTP
 */

const { getSession } = require('../config/db'); // Ajusta la ruta según tu estructura

const SongController = {
  /**
   * Listar canciones que le gustan a un usuario por email
   * GET /songs/user/:email
   */
  async getUserLikedSongs(req, res) {
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
      
      // Query a Neo4j para obtener canciones que le gustan al usuario
      const query = `
        MATCH (u:User)-[:listen]-(song:Song)
        WHERE u.email = $email
        RETURN song
      `;
      
      const result = await session.run(query, { email });
      
      // Verificar si se encontraron canciones
      if (result.records.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron canciones para este usuario o el usuario no existe'
        });
      }
      
      // Extraer todos los datos de las canciones
      const songs = result.records.map(record => {
        const songNode = record.get('song');
        return songNode.properties;
      });
      
      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Canciones encontradas',
        data: songs,
        count: songs.length
      });
      
    } catch (error) {
      console.error('Error al buscar canciones del usuario:', error);
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
     * Recomendaciones basadas en canciones populares que el usuario no ha escuchado
     * GET /songs/recommendations/popular/:email
     */

    async getPopularRecommendations(req, res) {
      const session = getSession();
    
      try {
        const { email } = req.params;
        
        // Validar que el email esté presente
        if (!email) {
          return res.status(400).json({
            success: false,
            message: 'Email requerido'
          });
        }
    
        // Query a Neo4j para obtener recomendaciones basadas en canciones populares que el usuario no ha escuchado y 
        // que pertenecen a géneros que el usuario ya ha escuchado

        const query = `
          MATCH (:User {email: $email})-[:listen]->(:Song)-[:belongs_to]->(g:Genre)
          WITH DISTINCT g
          MATCH (s:Song)-[:belongs_to]->(g)<-[:listen]-(u:User)
          WHERE NOT EXISTS {
            MATCH (:User {email: $email})-[:listen]->(s)
          }
          RETURN s AS song, COUNT(u) AS popularity
          ORDER BY popularity DESC
          LIMIT 5
        `;
        
        const result = await session.run(query, { email });
    
        // Verificar si se encontraron canciones
        if (result.records.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'No se encontraron recomendaciones populares para este usuario o el usuario no existe'
          });
        }
  
        // Extraer todos los datos de las canciones
        const recommendations = result.records.map(record => {
          const songNode = record.get('song');
          return songNode.properties;
        });
  
        // Respuesta exitosa
        res.status(200).json({
          success: true,
          message: 'Recomendaciones populares encontradas',
          data: recommendations,
          count: recommendations.length
        });
      }
  
      catch (error) {
        console.error('Error al buscar recomendaciones populares:', error);
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
     * Recomendacion de usuarios basada en canciones que le gustan a un usuario
     * GET /songs/recommendations/friends/:email
     */
  async getFriendsRecommendations(req, res) {
  const session = getSession();

  try {
    const { email } = req.params;
    
    // Validar que el email esté presente
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido'
      });
    }

    // Query a Neo4j usuarios que escuchan las mismas canciones que el usuario 
    // y calcular la similitud usando el índice de Jaccard
    const query = `
      MATCH (me:User {email: $email})-[:listen]->(s:Song)
      WITH me, COLLECT(DISTINCT s) AS mySongs

      MATCH (other:User)-[:listen]->(sharedSong:Song)
      WHERE me <> other AND sharedSong IN mySongs AND NOT (me)-[:friends]-(other)
      WITH me, other, COLLECT(DISTINCT sharedSong) AS sharedSongs, mySongs

      MATCH (other)-[:listen]->(otherSong:Song)
      WITH other, sharedSongs, mySongs, COLLECT(DISTINCT otherSong) AS otherSongs

      WITH other, SIZE(sharedSongs) AS intersection,
          (SIZE(mySongs) + SIZE(otherSongs) - SIZE(sharedSongs)) AS union

      WITH other, (1.0 * intersection / union) AS jaccardScore
      RETURN other AS similarUser, jaccardScore
      ORDER BY jaccardScore DESC
      LIMIT 5
    `;
    const result = await session.run(query, { email });

    // Verificar si se encontraron amigos
    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron recomendaciones de amigos para este usuario o el usuario no existe'
      });
    }

    // Extraer los emails de los usuarios similares
    const recommendations = result.records.map(record => ({
      email: record.get('similarUser'),
      similarityScore: record.get('jaccardScore')
    }));

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Recomendaciones de amigos encontradas',
      data: recommendations,
      count: recommendations.length
    });
  }
  catch (error) {
    console.error('Error al buscar recomendaciones de amigos:', error);
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
   * Recomendacion de canciones segun el genero que escucha un usuario
   * GET /songs/popular/:email
   */

  async getRecommendationByGenre(req, res) {
    const session = getSession();
    
    try {
      const { email } = req.params;
      
      // Validar que el email esté presente
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requerido'
        });
      }
    
      // Recomendacion de canciones basada 
      const query = `
        
      MATCH (u:User {email: $email})-[l:listen]->(:Song)-[:has_genre]->(g:Gender)
      WITH u, g, SUM(l.strength) AS genreScore
      ORDER BY genreScore DESC
      WITH u, COLLECT({genre: g, score: genreScore}) AS topGenres

      UNWIND topGenres AS genreData
      WITH u, genreData.genre AS g, genreData.score AS genreScore

      MATCH (s:Song)-[:has_genre]->(g)
      WHERE NOT (u)-[:listen]->(s)

      RETURN s.name AS Nombre
      ORDER BY genreScore DESC, rand()
      LIMIT 5
      `;
      
      const result = await session.run(query, { email });
    
      // Verificar si se encontraron canciones
      if (result.records.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron canciones populares por género para este usuario o el usuario no existe'
        });
      }
  
      // Extraer todos los datos de las canciones
      const songs = result.records.map(record => {
        const songNode = record.get('song');
        return songNode.properties;
      });
  
      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Canciones populares por género encontradas',
        data: songs,
        count: songs.length
      });
    }
  
    catch (error) {
      console.error('Error al buscar canciones populares por género:', error);
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
   * Recomendacion de canciones basada en el año de las canciones que le gustan a un usuario
   * GET /songs/popular/:email
   */

  async getRecommendationByYear(req, res) {
    const session = getSession();
    
    try {
      const { email } = req.params;
      
      // Validar que el email esté presente
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requerido'
        });
      }
    
      // Recomendacion de canciones basada en el año de las canciones que le gustan al usuario
      const query = `
        
      MATCH (u:User {email: $email})-[l:listen]->(s:Song)-[:released_in]->(y:Year)
      WITH u, y, SUM(l.strength) AS totalStrength
      ORDER BY totalStrength DESC
      LIMIT 3
      WITH u, COLLECT(y) AS topYears

      MATCH (rec:Song)-[:released_in]->(ry:Year)
      WHERE ry IN topYears AND NOT (u)-[:listen]->(rec)

      RETURN rec.name AS title
      ORDER BY rand()
      LIMIT 5
      `;
      
      const result = await session.run(query, { email });
    
      // Verificar si se encontraron canciones
      if (result.records.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron recomendaciones por año para este usuario o el usuario no existe'
        });
      }
  
      // Extraer todos los datos de las canciones
      const songs = result.records.map(record => {
        const songNode = record.get('song');
        return songNode.properties;
      });
  
      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Recomendaciones por año encontradas',
        data: songs,
        count: songs.length
      });
    }
  
    catch (error) {
      console.error('Error al buscar recomendaciones por año:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    } finally {
      await session.close();
    }

  },


  

};


module.exports = SongController;