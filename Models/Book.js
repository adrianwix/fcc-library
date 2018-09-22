var MongoClient = require("mongodb");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: [String]
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
