const db = require('./db');

// Ejemplo de consulta: obtener todos los personajes
db.query('SELECT * FROM personajes', (err, results) => {
  if (err) {
    console.error('Error al ejecutar la consulta:', err);
    return;
  }
  console.log('Personajes:');
  console.table(results);
});

// Ejemplo de inserción
const nuevoPersonaje = {
  nombre: 'Link',
  videojuego: 'The Legend of Zelda',
  año_lanzamiento: 1986,
  desarrollador: 'Nintendo'
};

db.query('INSERT INTO personajes SET ?', nuevoPersonaje, (err, result) => {
  if (err) {
    console.error('Error al insertar:', err);
    return;
  }
  console.log('Personaje insertado con ID:', result.insertId);
});

// Cerrar la conexión cuando hayas terminado
// db.end();