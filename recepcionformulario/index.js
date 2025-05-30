const express = require('express');
const cors = require('cors');
const personajesRoutes = require('./rutas/personajes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/personajes', personajesRoutes);

app.listen(3000, () => {
    console.log('Servidor Express corriendo en http://localhost:3000');
});
