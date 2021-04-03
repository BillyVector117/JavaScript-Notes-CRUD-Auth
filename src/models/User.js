// Notes Schema/Model type
const mongoose = require("mongoose"); // Allows to generate Schemas
const { Schema } = mongoose; // To use Schema methods
const bcryptjs = require("bcryptjs"); // Allows to Encrypt/Hash passwords

// Set properties to Note Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Use bcryptsjs to encrypt password (.methods.encryptPassword is part of bcryptjs's method)
UserSchema.methods.encryptPassword = async (password) => {
  // using typed passwrod by user
  const salt = await bcryptjs.genSalt(10); // Hash 10 times
  const hash = bcryptjs.hash(password, salt); // Get hash
  return hash;
};
// Validate typed password by user matches with Hash in database
UserSchema.methods.matchPassword = async function (password) {
  // Declarative function to avoid lost scope
  return await bcryptjs.compare(password, this.password); // Compares recently typed password (password) with database hashed password (this.password)
};

// Export Schema/Model as 'User'
module.exports = mongoose.model("User", UserSchema);
