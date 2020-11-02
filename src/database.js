// MODULO CONEXIÓN A LA DATABASE (Sera usado por index.js)
require('dotenv').config(); // Usar variables de entorno

const mongoose = require('mongoose') // Requerir modulo para conexión a mongoDB
process.env.MONGODB_URI
const URI = `mongodb+srv://billy:${process.env.PASSWORD}@cluster0.jiihy.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
// Método que permite conectarse a una dirección de internet
mongoose.connect(URI, { // Nombre de la base de datos
// Configuración objeto de mongoDB sencilla (funcionamiento de la biblioteca)
useCreateIndex: true,
useNewUrlParser: true,
useFindAndModify: false,
useUnifiedTopology: true
}) 
.then(db => console.log('DATABASE CONNECTED'))
.catch(err => console.log('kjlñj',err))
// 'mongodb://localhost/javascript-notes-db'
