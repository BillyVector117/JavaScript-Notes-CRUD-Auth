const passport = require("passport"); // To authenticate users
const LocalStrategy = require("passport-local").Strategy; // Authenticate locally
const User = require("../models/User"); // users Schema/Model

// passport.use() Define a new strategy to authenticate (named: ( 'local' ) )
passport.use(
  new LocalStrategy(
    {
      // Set how users will authenticate (E-mail)
      usernameField: "email",
    },
    // Values to define authenication
    async (email, password, done) => {
      const user = await User.findOne({ email: email }); // Query, capture typed/set Email and Password that matches in Database
      // Validate that user exists in Database
      if (!user) {
        // Fail case
        return done(null, false, { message: "User not found :(" });
      } else {
        // Success case, then validate password
        const match = await user.matchPassword(password); // Execute matchPassword() method to compare the real password with the recently typed (hash in database vs typed by user)
        if (match) {
          // Password matches case:
          return done(null, user); // Return user
        } else {
          return done(null, false, { message: " Incorrect Password" });
        }
      }
    }
  )
);

// Save ID user in a session
passport.serializeUser((user, done) => {
  // First param to set No-error, second param User's ID
  done(null, user.id);
});

// Almacenar en una sesión al usuario mediante el id generamos al usuario
passport.deserializeUser((id, done) => {
  // If a user exists...
  User.findById(id, (err, user) => {
    // Buscara por id a ese usuario, puede haber un error o encontrarlo
    done(err, user); // Si no hay error devuelve el user
  });
});
