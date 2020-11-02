// MODULO PRINCIPAL PARA ARRANCAR LA APLICACIÓN
const express = require('express') // Requerir express
const path = require('path') // Hacer uso de paths
const exphbs = require('express-handlebars') // Requerir modulo de template engines
const methodOverride = require('method-override') // Requiere modulo para que los formularios envien datos con otros métodos
const session = require('express-session') // Guardar las sesiones de los usuarios
const flash = require('connect-flash') // Enviar mensajes entre multiples vistas (middleware)
const passport = require('passport') // Modulo para autenticar usuarios
const handlebars =  require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'); // Evita error para capturar propiedades del usuario

//INITIALIZATION EXPRESS (configuración para inicializar base de datos, passport)
const app = express() // Usar el método express() de express
require('./database') // Requerir archivo database
require('./config/passport')

// SETTINGS (Configurar template engines, vistas)
const port = process.env.PORT || 3000 // Usa puerto de la nube, si no, 3000 por defecto

app.set('views', path.join(__dirname, 'views')) // Indica a Node donde se encuentra el directorio views (Contiene archivos de handlebars y estaticos)

// Configuración objeto de template engine (Handlebars)
app.engine('.hbs', exphbs({ // El nombre de los archivos seran .hbs, usando exphbs (handlebars como template engine)
    // Configuración básica Handlebars
    defaultLayout: 'main', // Archivo principal
    layoutsDir: path.join(app.get('views'), 'layouts'), // Directorio de archivo main (layout)
    partialsDir: path.join(app.get('views'), 'partials'), // Directorio de archivo para Pequeñas vistas/porciones HTML que se repetiran en otras vistas (footer, mensajes, nav)
    extname: '.hbs', // Indicar extensión final de los archivos
    handlebars: allowInsecurePrototypeAccess(handlebars) // Evita error por consola de handlebars
}))
app.set('view engine', '.hbs') // Indicar el template engine a usar (.hbs)

// MIDDLEWARES
// metodo para recibir datos de un formulario de manera correcta (sin imágenes, etc)
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method')); // Poder hacer peticiones PUT en los formularios
app.use(session({ // Configuración tipo objeto de session(creador de sesiones para cada usuario)
  secret: 'secretApp', // Palabra secreta
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize()) // Inicializa passport
app.use(passport.session()) // passport usara la sesión de express
app.use(flash()) // Modulo para enviar mensajes entre multiples vistas

// GLOBAL VARIABLES

// Los mensajes guardados en partials se podran mostrar en cualquier vista 
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg') // Crear variable (sucess_msg) que almacena los mensajes enviados por flash llamados success_msg y error_msg
  res.locals.error_msg = req.flash('error_msg') // Crear variable (error_msg) que almacena los mensajes enviados por flash llamados success_msg y error_msg
  res.locals.error = req.flash('error') // Crear variable (error) que almacena los mensajes enviados por flash llamados success y error
  res.locals.user = req.user || null // Para poder usarlo como 'saludo' cuando un usuario se logee
  next() // Indicar que siga con los siguientes middlewares

})

// ROUTES (Utiliza las rutas del directorio routes)
// Decirle a express dónde se encuentran las rutas
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))



// STATIC FILES (Configura los archivos estaticos, directorio public)
app.use(express.static(path.join((__dirname), 'public'))) // Indicar el directorio public (css, js, img)


// SERVER LISTENING
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  })
  