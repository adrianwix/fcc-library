/*
*
*
*       Complete the API routing below
*       
*       
*/

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb");
const mongoose = require("mongoose");
const Book = require("../Models/Book");

mongoose.connect(
  process.env.DB,
  function(err, db) {
    console.log("MongoDB connected");
  }
);

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find()
        .then(books => {
          res.json(books);
        })
        .catch(err => console.log(err));
    })

    .post(function(req, res) {
      const title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.status(400).send("No title send");
      }
      const book = new Book({ title });
      book
        .save()
        .then(book => {
          res.json(book);
        })
        .catch(err => console.log(err));
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      const _id = req.params._id;
      Book.deleteMany()
        .then(() => res.send("complete delete successful"))
        .catch(err => console.log(err));
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      const _id = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findOne({ _id })
        .then(book => res.json(book))
        .catch(err => res.status(404).json(err));
    })

    .post(function(req, res) {
      const _id = req.params.id;
      const comment = req.body.comment;
      if (!comment) {
        return res.send("no comment send");
      }
      //json res format same as .get
      Book.findOne({ _id })
        .then(book => {
          book.commentcount += 1;
          book.comments.unshift(comment);
          book
            .save()
            .then(book => res.json(book))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })

    .delete(function(req, res) {
      const _id = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id })
        .then(() => res.send("delete successful"))
        .catch(err => console.log(err));
    });
};
