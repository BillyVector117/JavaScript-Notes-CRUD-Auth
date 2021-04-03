// Main module to Config and run application
const express = require("express"); // To create a server
const path = require("path"); // Allow to use paths/directory
const handlebars = require("handlebars"); // Template-Engine
const exphbs = require("express-handlebars"); // Handlebars as Template-Engine with Express
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access"); // Required by Handlebars
const methodOverride = require("method-override"); // To send Put/Update methods though Submit Data-Forms
const session = require("express-session"); // Save User's session
const flash = require("connect-flash"); // Send messages between views (Middleware)
const passport = require("passport"); // User authentications

//INITIALIZATION EXPRESS (Database and Passport config)
const app = express(); // Allow to use all Express() methods
require("./database"); // Database connection
require("./config/passport"); // Passport config

// SETTINGS (Views, Template-Engines config, ports and static files)
const port = process.env.PORT || 3000;

// Set static Files path
app.set("views", path.join(__dirname, "views"));

// Template-Engine Object Config (Handlebars)
app.engine(
  ".hbs",
  exphbs({
    // Necessary config
    defaultLayout: "main", // Main file
    layoutsDir: path.join(app.get("views"), "layouts"), // Main File path (layout)
    partialsDir: path.join(app.get("views"), "partials"), // Partials (footer, mensajes, nav)
    extname: ".hbs", // Extension file
    handlebars: allowInsecurePrototypeAccess(handlebars), // To avoid error Logs
  })
);
// Setting Handlebars as Template-Engine
app.set("view engine", ".hbs");

// MIDDLEWARES
// To send correctly data info from Inputs-value (No support images)
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // Allows to use PUT/UPDATE/DELETE methods in Submit-forms
// Object config to use 'session' (Express-module) to create user's session
app.use(
  session({
    secret: "secretApp", // Secret word
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize()); // Init passport
app.use(passport.session()); // Passport will use session from 'Express-session' mixed
app.use(flash()); // To send messages in multiple views

// GLOBAL VARIABLES

// Messages saved in /partials will store in any view
app.use((req, res, next) => {
  // Create flash messages setting a nickname to each message
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null; // To use as 'greeting' when a user is logged
  next(); // Continue with next middlewares
});

// ROUTES
// Set routes path
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

// STATIC FILES (static files config ('public' directoy))
app.use(express.static(path.join(__dirname, "public"))); // Indicar el directorio public (css, js, img)

// SERVER LISTENER
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
