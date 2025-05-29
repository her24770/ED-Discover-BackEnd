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



};




module.exports = SongController;