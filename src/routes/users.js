const router = require('express').Router() // Require Express to create a server and its Router methods
const User = require('../models/User') // users Schema/Model
const passport = require('passport') // User authentications to REGISTER users

// Routes to './users/...
// Complete Url: ./routes/users/signin // LOG IN
router.get('/users/signin', (req, res) => {
    res.render('users/signin') // Render signin.hbs File as server response
})

// Complete Url: ./routes/users/signin // LOG IN (POST METHOD) Needs authenticate middleware by Passport
router.post('/users/signin', passport.authenticate('local', { // To authenticate users with authenticate() method in passport.js (passport module / strategy )
    successRedirect: '/notes', // Success case: redirect to /notes section
    failureRedirect: '/users/signin', // Failure case
    failureFlash: true // To allow Flash messages
}))

// Complete Url: ./routes/users/signup // SIGN UP to Resgister NEW users
router.get('/users/signup', (req, res) => {
    const footertrue = true // Optional
    res.render('users/signup', {footertrue}) // Render signup.hbs as server response and send 'footertrue'variable
})

// Data sent to Register a new User ( register ) ( POST )
router.post('/users/signup', async (req, res) => {
    try { 
        // Extract input values
    const { name, email, password, confirm_password} = req.body;
    const errors = [] // Allows to save and store errors
        // Validate inputs
    if ( password != confirm_password) {
        errors.push({ text: 'Password do not match' }) // Failure case: Save an error
    }
    if (password.length < 4) {
      errors.push({ text: "Password must be at least 5 characters" }); // Failure case: Save an error
    }
    // Validate Empty inputs
    if ( name.length <= 0 ) {errors.push({ text: 'Type a name'}) }
    if ( email.length <= 0 ) {errors.push({ text: 'Type your email'}) }
    if ( password.length <= 0 ) {errors.push({ text: 'Type your password'}) }
    if ( confirm_password.length <= 0 ) {errors.push({ text: 'Confirm your password'}) }

    // Validate amount of errors
    if (errors.length > 0 ) {
        res.render('users/signup', { errors, name, email, password, confirm_password}) // Failure case: Redirect at same page, but load the inputs value as placeholders
    } else {
        // Success case: validate E-mail used
        const emailUser = await User.findOne({ email: email }) // Query, If true, the typed E-mail has been previously used
        if ( emailUser ) {
            req.flash('error_msg', ' The Email is already in use :( ')
            res.redirect('/users/signup')
            console.log('Rejected user, E-mail is taken: ', req.body)
        }
        // All success Tests case: Create the new User
        const newUser = new User({ name, email, password}) // Instantiate a new user with User's Schema, setting the same properties as value
        newUser.password = await newUser.encryptPassword(password) // Replace typed password to a Hash and save it into database
        await newUser.save()
        req.flash('success_msg', 'You are registered now!') // 'Success' Flash message
        res.redirect('/users/signin') // Success registered case: Redirecto to SignIn section
        console.log( 'Successfully registered account! :', req.body)
    }} catch (error) { 'error', error}
})

// Creación ruta /logout para salir del perfil (usuario)
router.get('/users/logout', (req, res) => { // URL para logout
    req.logOut() // Método para terminar sesion ( passport ), de esta manera pierde el acceso a rutas para registrados
    res.redirect('/') // Redireccionar al inicio de la página
})
module.exports = router