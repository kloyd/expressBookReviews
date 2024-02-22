const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
         return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop, using Promise
public_users.get('/',function (req, res) {
    let book_list = new Promise((resolve,reject) => {
        fetchedBooks = books;
        resolve(fetchedBooks);
    });
    book_list.then((booklist) => {res.send(JSON.stringify({booklist},null,4))});
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const get_book_isbn_promise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
            if (isbn <= 10) {
                resolve((books[isbn]));
            } else {
                reject(res.send('ISBN not found'));
            }
        });
        get_book_isbn_promise.
            then((booklist) => {
                res.send(booklist)
            }).
            catch(function () { 
                console.log('ISBN not found');
      });
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const get_book_author = new Promise((resolve, reject) => {
    let author = req.params.author;
    let resultBooks = [];
    Object.keys(books).forEach((bookKey) => {
        let book = books[bookKey];
        if (book.author === author) 
        { 
         resultBooks.push(book);
        }
    });
    if (resultBooks.length > 0) {
        resolve(resultBooks);
    } else {
        reject(res.send("No books found for author " + author));
    }
  });

  get_book_author.then((booklist) => {
    res.send(booklist);
  }).catch(function() {
    console.log("No books found for author.");
  });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const get_book_title = new Promise((resolve, reject) => {
    let title = req.params.title;
    let resultBooks = [];
    Object.keys(books).forEach((bookKey) => {
        let book = books[bookKey];
        if (book.title === title) 
        { 
         resultBooks.push(book);
        }
    });
    if (resultBooks.length > 0) {
        resolve(resultBooks);
    } else {
        reject(res.send("No books found for title " + title));
    }
  });
  
  get_book_title.then((booklist) => {
    res.send(booklist);
  }).catch(function() {
    console.log("No books found for title.");
  });
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
