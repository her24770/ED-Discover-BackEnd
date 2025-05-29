MATCH (u1:User { email: "fernando@example.com" }), (u2:User { email: "rodassury@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "rodassury@example.com" }), (u2:User { email: "oswos@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "floresmaria@example.com" }), (u2:User { email: "aguilarcecilia@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "floresmaria@example.com" }), (u2:User { email: "renemaria@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "floresmaria@example.com" }), (u2:User { email: "lopezyensi@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "floresmaria@example.com" }), (u2:User { email: "floresgabriela@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "floresmaria@example.com" }), (u2:User { email: "moscozokatherine@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "aguilarcecilia@example.com" }), (u2:User { email: "renemaria@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "lopezyensi@example.com" }), (u2:User { email: "moscozokatherine@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "paula@example.com" }), (u2:User { email: "rodassury@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "paula@example.com" }), (u2:User { email: "oswos@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "paula@example.com" }), (u2:User { email: "luisa@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "paula@example.com" }), (u2:User { email: "sebastian@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "paula@example.com" }), (u2:User { email: "martin@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "sebastian@example.com" }), (u2:User { email: "martin@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "sebastian@example.com" }), (u2:User { email: "rodassury@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "sebastian@example.com" }), (u2:User { email: "oswos@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "martin@example.com" }), (u2:User { email: "rodassury@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "martin@example.com" }), (u2:User { email: "naoswos@example.comme" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "denisse@example.com" }), (u2:User { email: "alejandrodaniel@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "denisse@example.com" }), (u2:User { email: "francisco@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "alejandrodaniel@example.com" }), (u2:User { email: "francisco@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "kerson@example.com" }), (u2:User { email: "santiestebanmatteo@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "kerson@example.com" }), (u2:User { email: "coronadogabriela@example.com" })
CREATE (u1)-[:friends]->(u2);

MATCH (u1:User { email: "santiestebanmatteo@example.com" }), (u2:User { email: "coronadogabriela@example.com" })
CREATE (u1)-[:friends]->(u2);