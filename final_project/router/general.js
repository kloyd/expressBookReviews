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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let resultBooks = [];
  Object.keys(books).forEach((bookKey) => {
    let book = books[bookKey];
    if (book.author === author) 
    { 
        resultBooks.push(book);
    }
  });
  res.send(resultBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
  let resultBooks = [];
  Object.keys(books).forEach((bookKey) => {
    let book = books[bookKey];
    if (book.title === title) 
    { 
        resultBooks.push(book);
    }
  });
  res.send(resultBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
