// User is automatically redirect to /notes/ once is logged
const router = require("express").Router(); // Require Express to create a server and its Router methods
const Note = require("../models/Note"); // notes Schema/Model
// ALL REQ.FLASH() ARE INVOQUED IN main.hbs as 'partials' but are generated here in each server response
// isAuthenticated (middleware) allows to prevent unregistered users enter to any /notes routes
const { isAuthenticated } = require("../helpers/auth"); // Requiere modulo para usar su método authenticated (asegurar paginas para los no-logeados)

// Complete Url: /notes/
router.get("/notes", isAuthenticated, async (req, res) => {
  // Get all documents ONLY FROM CURRENT USER, in query, 'user' references to Note (Model) property, and req.user.id is the current user ID
  const notes = await Note.find({ user: req.user.id })
    .lean()
    .sort({ date: "desc" }); // From all documents, only capture which user property = user ID
  // console.log(notes)
  res.render("notes/all-notes", { notes }); // Redirect to 'notes/all-notes' section and send the found notes
});

// Complete Url: /notes/add (Render to Create document route)
router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/newNote");
});

// Complete Url: /notes/newNote CREATE/ADD a document/note with POST method
router.post("/notes/newNote", isAuthenticated, async (req, res) => {
  // Extract input-value-Form
  const { title, description } = req.body;
  const errors = [];
  // Notes Validations
  if (!title) {
    errors.push({ text: "The note must have a Title" });
  }
  if (!description) {
    errors.push({ text: "The note must have a Description" });
  }
  if (errors.length > 0) {
    // Error case: redirect at same page, but send through headers the errors message, title and description as placeholders
    res.render("notes/newNote", {
      errors,
      title,
      description,
    });
  } else {
    // Success case: Create a new Note instance with req.body (Data-input-Form)
    const newNote = new Note({ title, description });
    const fine = "DATA SENT SUCCESSFULLY";
    newNote.user = req.user.id; // Re-write newNote object and set the current user id at 'user' property
    await newNote.save();
    req.flash("success_msg", "Note added Successfully!");
    console.log(`${fine}, Note created: `, newNote);
    res.redirect("/notes"); // Redirect to /notes to ensure new Note has been created
  }
});

// Complete Url: /notes/edit/:id ( UPDATE NOTE ), :id refers to each note _id
router.get("/notes/edit/:id", isAuthenticated, async (req, res) => {
  // Search by ID the note (each card has update icon, and it has _id property)
  const note = await Note.findById(req.params.id).lean();
  res.render("notes/edit-note", { note });
});
// Complete Url: /notes/edit-note/:id to UPDATE A document/note (Icon-button)
router.put("/notes/edit-note/:id", isAuthenticated, async (req, res) => {
  const { title, description } = req.body; // 'title' and 'description' are 'input names'
  // Find the document by Url-Params and override its properties (title, description) with the new ones (req.body)
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Note updated Successfully!");
  res.redirect("/notes"); // Redirect to /notes to ensure and visualize updated notes
});

// Complete Url: /notes/delete/:id to DELETE A document/note (thorugh DELETE method, but with method-override send with POST method)
router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  // Delete the note with the same Url-Params as ID
  await Note.findByIdAndDelete(req.params.id).lean();
  req.flash("error_msg", "Note deleted Successfully!");
  res.redirect("/notes"); // Redirect to /notes to ensure and visualize deleted notes
});
module.exports = router;
