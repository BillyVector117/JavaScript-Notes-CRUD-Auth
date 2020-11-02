const router = require('express').Router() // Requerir express y su modulo router para crear rutas ( Asi en cada respuesta usamos su método render para RENDERIZAR un archivo con esa vista)
const User = require('../models/User') // Requerimos modulo User ( modelo de datos ) para referenciar los datos insertados en el input con los datos "reales" dentro de la base de datos
const passport = require('passport') // Modulo para autenticar usuarios ya registrados

// Enrutador que crea la ruta para los usuarios (...users/...)

// Creación de ruta /signin para iniciar sesión
router.get('/users/signin', (req, res) => {// URL para iniciar sesión
    res.render('users/signin') // Renderizar el archivo sign in
})

// Creación de ruta /signin ( POST ) para autenticar usuario ( una vez que se haya registrado, dado submit)
router.post('/users/signin', passport.authenticate('local', { // La manera en que se autenticara el usuario es con local ( modulo passport / estrategia creada )
    successRedirect: '/notes', // Si la autenticación fue exitosa redirigelo a la ruta notas
    failureRedirect: '/users/signin', // Si la autenticación fallo redirigelo al signin (quiza se registro mal o se equivoco)
    failureFlash: true // Para poder enviarle mensajes flash durante la autenticación
}))

// Creación ruta /signup para identificar a cada usuario nuevo ( registro )
router.get('/users/signup', (req, res) => { // URL para registrarse
    const footertrue = true // Variable para hacer saber que se encuentra en esta paginay cambiar el footer
    res.render('users/signup', {footertrue}) // Renderizar el archivo signup, al renderizar tambien le pasamos la vriable footertrue para saber que esta en dicha ruta
})

// Creación ruta /signup para recibir los datos del submit ( registro ) ( POST )
router.post('/users/signup', async (req, res) => { // URL / ruta para recibir los datos al dar submit ( igual a la del form signup, pero con metodo POST )
    try { 
    const { name, email, password, confirm_password} = req.body // Capturar todos los datos de cada input del formulario ( datos introducidos por el usuario )
    const errors = [] // Array para almacenar errores ( y agregarlos mediante push )
    // Validar si ambas contraseñas son identicas
    if ( password != confirm_password) { // En caso de que no ...
        errors.push({ text: 'Password do not match' }) // Almacena un objeto con propiedad error en el array ( errors )
    }
    // Validad si la contraseña tiene un tamaño apropiado ( > 4 )
    if ( password.length < 4 ) { // De lo contrario...
        errors.push({ text: 'Password must be at least 5 characters'}) // Almacena un objeto con propiedad error en el array ( errors )
    }
    // Validar campo vacio 1
    if ( name.length <= 0 ) {errors.push({ text: 'Type a name'}) }
    // Validar campo vacio 2
    if ( email.length <= 0 ) {errors.push({ text: 'Type your email'}) }
    // Validar campo vacio 3
    if ( password.length <= 0 ) {errors.push({ text: 'Type your password'}) }
    // Validar campo vacio 4
    if ( confirm_password.length <= 0 ) {errors.push({ text: 'Confirm your password'}) }    

    // Validar si existen errores y re dirigir al usuario ( cualquier error re dirige a realizar el mismo registro )
    if (errors.length > 0 ) { // Si la longitud de errores es mayor a 0...
        res.render('users/signup', { errors, name, email, password, confirm_password}) // Renderizalo a la misma página pero con los datos errores ( para poder mostrar mensajes con flash y colocarlos como "placeholder" )
    } else { // Si no tiene errores...
        // Validar si el correo es usadó
        const emailUser = await User.findOne({ email: email }) // Query, busca por email el email introducido por el usuario, si lo encuentra quiere decir que ya ha sido usado anteriormente
        if ( emailUser ) { // Si hay un emailUser (correo repetido) marca un error de correo usado
            req.flash('error_msg', ' The Email is already in use :( ') // mensaje flash error por correo usado
            res.redirect('/users/signup') // Redirecciona al signup
            console.log('usuario rechazado por correo repetidó: ', req.body)
        }
        const newUser = new User({ name, email, password}) // Instanciar un objeto de la clase User (modelo de datos) pasandole los datos del form
        newUser.password = await newUser.encryptPassword(password) // Remplazar la contraseña (propiedad del objeto User)por el hash (método en el modelo de datos)
        await newUser.save() // Guardamos el usuario nuevo
        req.flash('success_msg', 'You are registered now!') // Mensaje exito de flash ( req.flash es una variable global definida en index, usamos la que tiene mensaje exitoso pasandole como parametro el mensaje )
        res.redirect('/users/signin') // Una vez se registre, redireccionamos al usuario a la vista login ( Iniciar sesión )
        console.log( 'Successfully registered account! :', req.body)
    }} catch (err) { 'error', err}
})

// Creación ruta /logout para salir del perfil (usuario)
router.get('/users/logout', (req, res) => { // URL para logout
    req.logOut() // Método para terminar sesion ( passport ), de esta manera pierde el acceso a rutas para registrados
    res.redirect('/') // Redireccionar al inicio de la página
})
module.exports = router