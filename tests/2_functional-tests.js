/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

const Book = require("../Models/Book");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */

  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite("Routing tests", function() {
    let id;
    let title;

    before(() => {
      return new Promise((resolve, reject) => {
        const book = new Book({ title: "Book for Testing" });
        book
          .save()
          .then(book => {
            id = book._id;
            title = book.title;
            resolve();
          })
          .catch(err => reject(err));
      });
    });

    after(() => {
      chai
        .request(server)
        .delete("/api/books/" + id)
        .end((res, err) => {
          console.log(res);
          assert.equal(res.text, "delete successful");
        });
    });

    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Book test"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "Book test");
              assert.isArray(res.body.comments);
              assert.isNumber(res.body.commentcount);
              assert.equal(res.body.commentcount, 0);
              assert.isNull(err);
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .end((err, res) => {
              assert.equal(res.status, 400);
              assert.equal(res.text, "No title send");
              assert.isNotNull(err);
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isString(res.body[0].title);
            assert.isNotNull(res.body[0].title);
            assert.isNumber(res.body[0].commentcount);
            assert.isNotNull(res.body[0].commentcount);
            assert.isArray(res.body[0].comments);
            assert.isNotNull(res.body[0].comments);
            assert.isNull(err);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        let errorMessage =
          'Cast to ObjectId failed for value "31253546235" at path "_id" for model "Book"';
        chai
          .request(server)
          .get("/api/books/31253546235")
          .end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.body.message, errorMessage);
            assert.isNotNull(err);
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, title);
            assert.isArray(res.body.comments);
            assert.isNumber(res.body.commentcount);
            assert.equal(res.body.commentcount, 0);
            assert.isNull(err);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({
              comment: "Comment for testing the API"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, title);
              assert.isArray(res.body.comments);
              assert.equal(res.body.comments[0], "Comment for testing the API");
              assert.isNumber(res.body.commentcount);
              assert.equal(res.body.commentcount, 1);
              assert.isNull(err);
              done();
            });
        });
      }
    );
  });
});
