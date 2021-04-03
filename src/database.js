// Database connection (used in Index.js)
require("dotenv").config();
const mongoose = require("mongoose"); // To connect to mongoDB
process.env.MONGODB_URI;
const URI = `mongodb+srv://billy:${process.env.PASSWORD}@cluster0.jiihy.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose
  .connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((error) => console.log("ERROR: ", error));
// 'mongodb://localhost/javascript-notes-db'
