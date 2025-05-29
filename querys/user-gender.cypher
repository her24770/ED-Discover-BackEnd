MATCH (u1:User { email: "name" }), (g1:Gender { name: "Flamenco Pop" })
CREATE (u1)-[:like { strength: 88 }]->(g1);
