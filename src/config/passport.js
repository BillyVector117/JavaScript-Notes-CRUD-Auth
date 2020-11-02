const passport = require('passport') // Modulo para guardar sesiones de usuarios ( autenticarlos )
const LocalStrategy = require('passport-local').Strategy // Modulo para autenticarlos de manera local
const User = require('../models/User') // Requerir modulo de modelo de datos

// passport.use() Define una nueva estrategia de autenticación ( Tiene como nombre de authenticate ( 'local' ) )
passport.use(new LocalStrategy({
    // Indicamos a través de que se autenticara el usuario
    usernameField: 'email'
}, async (email, password, done) => { // Valores para definir la autenticación
    const user = await User.findOne({email: email}) // Query, captura el correo con el correo pasado por parametro
    // Validar que existe ese correo en la base de datos
    if (!user) { // Si no existe...
        return done(null, false, { message: 'User not found :(' }) // Termina la ejecución/ proceso de autenticación con un mensaje de no usuario
    } else { // Si el correo EXISTE, ahora validara la contraseña
        const match = await user.matchPassword(password) // Se ejecuta el método match para comparar las contraseñas (hash, con la que el usuario acaba de tipear)
        if (match) { // Si la contraseña que el usuario a digitado coincide con el hash mas el correo encontrado...
            return done(null, user) // entonces devuelve el usuario
        } else {
            return done(null, false, {message: ' Incorrect Password'})
        }
    }
}))

// Almacenar en una sesión el id del usuario
passport.serializeUser((user, done) => { // Toma un usuario y CB
    done(null, user.id) // Ejecuta el callback con un error null (No hay errores) y el id del usuario
})

// Almacenar en una sesión al usuario mediante el id generamos al usuario
passport.deserializeUser((id, done) => { // Si hay un usuario en la sesion
    User.findById(id,  (err, user) => { // Buscara por id a ese usuario, puede haber un error o encontrarlo
    done(err, user) // Si no hay error devuelve el user
    })
})

