const express = require('express');
const router = express.Router();
const db = require('../db');

// Validación de datos
const validarPersonaje = (personaje) => {
  if (!personaje.nombre || typeof personaje.nombre !== 'string') {
    return 'Nombre inválido';
  }
  if (!personaje.videojuego || typeof personaje.videojuego !== 'string') {
    return 'Videojuego inválido';
  }
  if (!personaje.año_lanzamiento || isNaN(personaje.año_lanzamiento)) {
    return 'Año de lanzamiento inválido';
  }
  if (!personaje.desarrollador || typeof personaje.desarrollador !== 'string') {
    return 'Desarrollador inválido';
  }
  return null;
};

// Obtener todos los personajes con paginación
router.get('/', (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1;
  const porPagina = parseInt(req.query.porPagina) || 10;
  const offset = (pagina - 1) * porPagina;

  // Consulta base con conteo total
  const consultaBase = 'SELECT * FROM personajes';
  const consultaConteo = 'SELECT COUNT(*) AS total FROM personajes';

  // Aplicar filtros si existen
  let whereClause = '';
  const params = [];
  if (req.query.busqueda) {
    whereClause = ' WHERE nombre LIKE ? OR videojuego LIKE ? OR desarrollador LIKE ?';
    params.push(`%${req.query.busqueda}%`, `%${req.query.busqueda}%`, `%${req.query.busqueda}%`);
  }

  // Consulta paginada
  db.query(`${consultaBase}${whereClause} LIMIT ? OFFSET ?`, [...params, porPagina, offset], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener personajes' });

    // Obtener total de registros
    db.query(`${consultaConteo}${whereClause}`, params, (errConteo, conteoResult) => {
      if (errConteo) return res.status(500).json({ error: 'Error al contar personajes' });

      const total = conteoResult[0].total;
      const totalPaginas = Math.ceil(total / porPagina);

      res.json({
        datos: results,
        paginacion: {
          pagina,
          porPagina,
          total,
          totalPaginas
        }
      });
    });
  });
});

// Obtener un personaje por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM personajes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el personaje' });
    if (results.length === 0) return res.status(404).json({ error: 'Personaje no encontrado' });
    res.json(results[0]);
  });
});

// Agregar personaje
router.post('/', (req, res) => {
  const { nombre, videojuego, año_lanzamiento, desarrollador } = req.body;
  const nuevoPersonaje = { nombre, videojuego, año_lanzamiento, desarrollador };
  
  const errorValidacion = validarPersonaje(nuevoPersonaje);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  db.query('INSERT INTO personajes SET ?', nuevoPersonaje, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear el personaje' });
    res.status(201).json({ id: result.insertId, ...nuevoPersonaje });
  });
});

// Actualizar personaje
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, videojuego, año_lanzamiento, desarrollador } = req.body;
  const datosActualizados = { nombre, videojuego, año_lanzamiento, desarrollador };
  
  const errorValidacion = validarPersonaje(datosActualizados);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  db.query('UPDATE personajes SET ? WHERE id = ?', [datosActualizados, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el personaje' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Personaje no encontrado' });
    res.json({ id, ...datosActualizados });
  });
});

// Eliminar personaje
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM personajes WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el personaje' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Personaje no encontrado' });
    res.json({ mensaje: 'Personaje eliminado correctamente', id });
  });
});
// Añade esto al final de personajes.js, antes de module.exports

// Ruta para recibir datos de formulario
router.post('/formulario', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  
  // Validación simple
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Aquí normalmente procesarías los datos (guardar en BD, enviar email, etc.)
  console.log('Datos del formulario recibidos:', { nombre, email, mensaje });

  // Respuesta exitosa
  res.json({ 
    success: true,
    message: 'Formulario recibido correctamente',
    datos: { nombre, email, mensaje }
  });
});
module.exports = router;
