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
  }
};

module.exports = SongController;