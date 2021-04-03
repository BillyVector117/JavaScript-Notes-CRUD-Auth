// This module (Middleware) is used to check/ensure exists an active user logged
const helpers = {}; // This objects will have more methods
// Here isAuthenticated() is a helpers(object) property
helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // Failure case:
  req.flash("error_msg", "Not authotized");
  res.redirect("/users/signin");
};
module.exports = helpers;
