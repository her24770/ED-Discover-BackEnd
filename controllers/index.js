const { getSession } = require('../config/db');

// Obtener todos los nodos
const getAllNodes = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (n) RETURN n LIMIT 100');
    const nodes = result.records.map(record => {
      const node = record.get('n');
      return {
        id: node.identity.toNumber(),
        ...node.properties
      };
    });
    
    res.json({
      success: true,
      count: nodes.length,
      data: nodes
    });
  } catch (error) {
    console.error('Error al obtener nodos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los nodos',
      error: error.message
    });
  } finally {
    await session.close();
  }
};

// Crear un nuevo nodo
const createNode = async (req, res) => {
  const session = getSession();
  try {
    const { label, ...properties } = req.body;
    
    if (!label) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un label para el nodo'
      });
    }
    
    // Convertir propiedades a formato de parámetros Neo4j
    const params = { properties };
    
    // Crear consulta dinámica
    const query = `
      CREATE (n:${label} $properties)
      RETURN n
    `;
    
    const result = await session.run(query, params);
    const createdNode = result.records[0].get('n');
    
    res.status(201).json({
      success: true,
      data: {
        id: createdNode.identity.toNumber(),
        ...createdNode.properties
      }
    });
  } catch (error) {
    console.error('Error al crear nodo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el nodo',
      error: error.message
    });
  } finally {
    await session.close();
  }
};

// Obtener un nodo por ID
const getNodeById = async (req, res) => {
  const session = getSession();
  try {
    const id = parseInt(req.params.id);
    const result = await session.run(
      'MATCH (n) WHERE id(n) = $id RETURN n',
      { id }
    );
    
    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún nodo con ID ${id}`
      });
    }
    
    const node = result.records[0].get('n');
    
    res.json({
      success: true,
      data: {
        id: node.identity.toNumber(),
        ...node.properties
      }
    });
  } catch (error) {
    console.error('Error al obtener nodo por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el nodo',
      error: error.message
    });
  } finally {
    await session.close();
  }
};

// Actualizar un nodo por ID
const updateNode = async (req, res) => {
  const session = getSession();
  try {
    const id = parseInt(req.params.id);
    const properties = req.body;
    
    // Verificar si el nodo existe
    const checkResult = await session.run(
      'MATCH (n) WHERE id(n) = $id RETURN n',
      { id }
    );
    
    if (checkResult.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún nodo con ID ${id}`
      });
    }
    
    // Crear consulta para actualizar propiedades
    const result = await session.run(
      'MATCH (n) WHERE id(n) = $id SET n += $properties RETURN n',
      { id, properties }
    );
    
    const updatedNode = result.records[0].get('n');
    
    res.json({
      success: true,
      data: {
        id: updatedNode.identity.toNumber(),
        ...updatedNode.properties
      }
    });
  } catch (error) {
    console.error('Error al actualizar nodo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el nodo',
      error: error.message
    });
  } finally {
    await session.close();
  }
};

// Eliminar un nodo por ID
const deleteNode = async (req, res) => {
  const session = getSession();
  try {
    const id = parseInt(req.params.id);
    
    // Verificar si el nodo existe
    const checkResult = await session.run(
      'MATCH (n) WHERE id(n) = $id RETURN n',
      { id }
    );
    
    if (checkResult.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún nodo con ID ${id}`
      });
    }
    
    // Eliminar el nodo
    await session.run(
      'MATCH (n) WHERE id(n) = $id DETACH DELETE n',
      { id }
    );
    
    res.json({
      success: true,
      message: `Nodo con ID ${id} eliminado correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar nodo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el nodo',
      error: error.message
    });
  } finally {
    await session.close();
  }
};

module.exports = {
  getAllNodes,
  createNode,
  getNodeById,
  updateNode,
  deleteNode
};