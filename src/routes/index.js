const router = require('express').Router() // Requerir express y su modulo router para crear rutas

// Enrutador que crea la ruta para el index
router.get('/', (req, res) => {
    res.render('index') // Renderizamos como respuesta el archivo index (.hbs) del directorio views
})
// Creación ruta /about
router.get('/about', (req, res) => {
    res.render('about') // Renderizamos como respuesta el archivo about (.hbs) del directorio views
})
module.exports = router