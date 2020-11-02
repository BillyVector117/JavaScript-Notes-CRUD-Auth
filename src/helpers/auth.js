// Objeto con multiples métodos, asegura rutas para los que no se han registrado
const helpers = {} // Crear un objeto (tendra varios métodos)

helpers.isAuthenticated = (req, res, next ) => { // helpers tiene una propiedad la cual es una función
    if(req.isAuthenticated()) { // Si el usuario se ha registrado retorna true, si no, false
        return next() // Si se ha registrado continua con el middleware
    }
    req.flash('error_msg', 'Not authotized') // Mensaje de flash (error)
    res.redirect('/users/signin') // Redirecciona al formulario de signin si el usuario no se ha registrado
}
module.exports = helpers