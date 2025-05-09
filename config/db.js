/*
 *Gestiona todas las conexiones a la base de datos Neo4j.
 */

const neo4j = require('neo4j-driver');
require('dotenv').config();

const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD,
  NEO4J_DATABASE
} = process.env;

//conexion de driver
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);


//creaciond de sesion, reutilizar configuracion
const getSession = () => {
  return driver.session({
    database: NEO4J_DATABASE
  });
};

// Función para probar la conexión
const testConnection = async () => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (n) RETURN count(n) AS count');
    console.log('Conexion a base de datos exitosa');
    const count = result.records[0].get('count').toNumber();
    console.log(`Base de datos contiene ${count} nodos`);
    return true;
  } catch (error) {
    console.error('Error al conectar con Neo4j:', error);
    return false;
  } finally {
    await session.close();
  }
};

// Cierre de driver
const closeDriver = async () => {
  await driver.close();
  console.log('Conexión a Neo4j cerrada');
};

// Exportar funciones, reutilizar configuracion
module.exports = {
  getSession,
  testConnection,
  closeDriver
};