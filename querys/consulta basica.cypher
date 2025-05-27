MATCH (n) DETACH DELETE n

CALL db.schema.visualization()

MATCH (n)-[r]->(m) RETURN n, r, m;
