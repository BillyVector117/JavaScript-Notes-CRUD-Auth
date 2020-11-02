// Definir estructura de modelo de datos
const mongoose = require('mongoose') // Requerir mongoose para generar esquema de datos
const { Schema } = mongoose // Requerir la clase esquema de datos de moongose

// Clase que define la estructura de las notas (propiedades, valor)
const NoteSchema = new Schema ({
    title: { type: String, required: true }, // Titulo requerido
    description: { type: String, required: true }, // descripción requerido
    date: { type: Date, default: Date.now }, // Si no digitamos una fecha nos devolvera la actual de creación
    user: { type: String } // Almacena el id del usuario. (al momento que se crea una nota nueva)
})


// Exportar modulo del modelo de datos de mongoose
module.exports = mongoose.model('Note', NoteSchema) // Exportar el esquema NoteSchema como Note