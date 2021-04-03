// Notes Schema/Model type
const mongoose = require("mongoose"); // Allows to generate Schemas
const { Schema } = mongoose; // To use Schema methods

// Set properties to Note Schema
const NoteSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: String }, // Save User's ID when is created
});
// Export Schema/Model as 'Note'
module.exports = mongoose.model("Note", NoteSchema);
