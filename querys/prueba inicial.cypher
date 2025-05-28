// Limpiar base de datos (opcional)
MATCH (n) DETACH DELETE n;

// 1. Crear usuarios
CREATE 
  (u1:User { name: "Ana López", email: "ana@example.com", date_Birth: date("1995-05-15"), password: "abc123" }),
  (u2:User { name: "Carlos Ruiz", email: "carlos@example.com", date_Birth: date("1990-11-22"), password: "def456" });

// 2. Crear artistas
CREATE
  (a1:Artist { name: "Rosalía", biography: "Spanish flamenco-pop artist", photo: "https://example.com/rosalia.jpg" }),
  (a2:Artist { name: "Bad Bunny", biography: "Puerto Rican reggaeton singer", photo: "https://example.com/badbunny.jpg" });

// 3. Crear emociones
CREATE
  (e1:Emotion { feeling: "Energetic", danceable: true }),
  (e2:Emotion { feeling: "Melancholic", danceable: false });

// 4. Crear géneros
CREATE
  (g1:Gender { name: "Flamenco Pop", description: "Fusion of flamenco and pop" }),
  (g2:Gender { name: "Reggaeton", description: "Urban music from Puerto Rico" });

// 5. Crear idiomas
CREATE
  (l1:Language { language: "Spanish" }),
  (l2:Language { language: "English" });

// 6. Crear regiones
CREATE
  (r1:Region { country: "Spain", continent: "Europe" }),
  (r2:Region { country: "Puerto Rico", continent: "America" });

// 7. Crear años
CREATE
  (y1:Year { startYear: 2020, finishYear: 2020 }),
  (y2:Year { startYear: 2022, finishYear: 2022 });

// 8. Crear álbumes
CREATE
  (al1:Album { name: "Motomami", nSongs: 12, cover: "https://example.com/motomami.jpg", duration: 2400, likes: 1500000 }),
  (al2:Album { name: "Un Verano Sin Ti", nSongs: 23, cover: "https://example.com/verano.jpg", duration: 3600, likes: 2500000 });

// 9. Crear canciones
CREATE
  (s1:Song { name: "SAOKO", code: "ROS001", cover: "https://example.com/saoko.jpg", producer: "Rosalía", writer: "Rosalía", bpm: 120, reproductions: 50000000, likes: 3000000 ,duration : 180}),
  (s2:Song { name: "Tití Me Preguntó", code: "BUN002", cover: "https://example.com/titi.jpg", producer: "Bad Bunny", writer: "Bad Bunny", bpm: 98, reproductions: 80000000, likes: 4500000, duration: 210 });

// --------------------------------------------
// CONEXIONES SEGÚN TU ESQUEMA
// --------------------------------------------

// Usuario -> Canción [listen]
MATCH (u1:User { name: "Ana López" }), (s1:Song { code: "ROS001" })
CREATE (u1)-[:listen { strength: 85 }]->(s1);

MATCH (u2:User { name: "Carlos Ruiz" }), (s2:Song { code: "BUN002" })
CREATE (u2)-[:listen { strength: 92 }]->(s2);

// Usuario -> Usuario (follow entre usuarios)
MATCH (u1:User { name: "Ana López" }), (u2:User { name: "Carlos Ruiz" })
CREATE (u1)-[:friends]->(u2);

// Usuario -> Artista [follow]
MATCH (u1:User { name: "Ana López" }), (a1:Artist { name: "Rosalía" })
CREATE (u1)-[:follow { strength: 90 }]->(a1);

// Usuario -> Género [like]
MATCH (u1:User { name: "Ana López" }), (g1:Gender { name: "Flamenco Pop" })
CREATE (u1)-[:like { strength: 88 }]->(g1);

// Usuario -> Año [preference]
MATCH (u2:User { name: "Carlos Ruiz" }), (y2:Year { startYear: 2022 })
CREATE (u2)-[:preference { strength: 75 }]->(y2);

// Usuario -> Idioma [preference]
MATCH (u1:User { name: "Ana López" }), (l1:Language { language: "Spanish" })
CREATE (u1)-[:preference { strength: 95 }]->(l1);

// Usuario -> Emoción [feeling]
MATCH (u2:User { name: "Carlos Ruiz" }), (e1:Emotion { feeling: "Energetic" })
CREATE (u2)-[:feeling { strength: 80 }]->(e1);

// Usuario -> Región [preference]
MATCH (u1:User { name: "Ana López" }), (r1:Region { country: "Spain" })
CREATE (u1)-[:preference { strength: 70 }]->(r1);

// Canción -> Álbum
MATCH (s1:Song { code: "ROS001" }), (al1:Album { name: "Motomami" })
CREATE (s1)-[:belongs_to]->(al1);

// Canción -> Artista
MATCH (s1:Song { code: "ROS001" }), (a1:Artist { name: "Rosalía" })
CREATE (s1)<-[:performs]-(a1);

// Canción -> Género
MATCH (s1:Song { code: "ROS001" }), (g1:Gender { name: "Flamenco Pop" })
CREATE (s1)-[:has_genre]->(g1);

// Canción -> Año
MATCH (s1:Song { code: "ROS001" }), (y1:Year { startYear: 2020 })
CREATE (s1)-[:released_in]->(y1);

// Canción -> Idioma
MATCH (s1:Song { code: "ROS001" }), (l1:Language { language: "Spanish" })
CREATE (s1)-[:in_language]->(l1);

// Canción -> Emoción
MATCH (s1:Song { code: "ROS001" }), (e1:Emotion { feeling: "Energetic" })
CREATE (s1)-[:evokes]->(e1);

// Artista -> Idioma
MATCH (a1:Artist { name: "Rosalía" }), (l1:Language { language: "Spanish" })
CREATE (a1)-[:speaks]->(l1);

// Artista -> Género
MATCH (a1:Artist { name: "Rosalía" }), (g1:Gender { name: "Flamenco Pop" })
CREATE (a1)-[:specializes_in]->(g1);

// Artista -> Región
MATCH (a1:Artist { name: "Rosalía" }), (r1:Region { country: "Spain" })
CREATE (a1)-[:from]->(r1);

// Artista -> Emoción
MATCH (a1:Artist { name: "Rosalía" }), (e1:Emotion { feeling: "Energetic" })
CREATE (a1)-[:associated_with]->(e1);

// Álbum -> Artista
MATCH (al1:Album { name: "Motomami" }), (a1:Artist { name: "Rosalía" })
CREATE (al1)-[:by_artist]->(a1);