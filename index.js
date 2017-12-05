var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
var cors = require('cors');
var MongoClient = require("mongodb").MongoClient;

var mdbURL = "mongodb://djluis:djluis@ds149855.mlab.com:49855/si1718-lgm-books";

var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.json());
app.use(helmet());

//app.use(express.static('./'));
//data: author, title, publisher, year, isbn

var baseURL = "/api/v1";

var db;

MongoClient.connect(mdbURL,{native_parser:true},(err, database) => {
    
    if(err){
        console.log(err);
    }
    
    db = database.collection("books");
    
});

// GET a collection
app.get(baseURL+"/books", function(req,res){
    
    var query = {};
    var fields = ["author", "title", "publisher", "year", "idBooks", "keywords"];

    for(var i = 0; i < fields.length; i++) {
        var key = fields[i];
        if (req.query.hasOwnProperty(key)) {
            query[key] = { $regex: '.*' + req.query[key] + '.*', $options: 'i' };
        }
    }
    
    db.find(query).toArray((err,books) => {
        if(err){
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500);
        }else{
            console.log("INFO: Sending books: " + JSON.stringify(books, 2, null));
            res.send(books);
        }
    });
    
    /*db.find({}).toArray((err,books) => {
        if(err){
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500);
        }else{
            console.log("INFO: Sending books: " + JSON.stringify(books, 2, null));
            res.send(books);
        }
    });*/
});

//POST over a collection
app.post(baseURL+"/books", function(req,res){
    var newBook = req.body;
    
    if(!newBook){
        console.log("WARNING: New POST request to /books/ without book, sending 400...");
        res.sendStatus(400);
    }else{
        if(!newBook.author || !newBook.title || !newBook.publisher || !newBook.year || !newBook.idBooks){
            console.log("WARNING: The book: " + JSON.stringify(newBook, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422);
        }else{
            db.findOne({idBooks:newBook.idBooks},function(err,book){
                if(err){
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500);
                }else{
                    if(book){
                        console.log("WARNING: The book: " + JSON.stringify(newBook, 2, null) + " already extis, sending 409...");
                        res.sendStatus(409);
                    }else{
                        console.log("INFO: Adding book " + JSON.stringify(newBook, 2, null));
                        db.insert(newBook);
                        res.sendStatus(201);
                    }
                }
            });
        }
    }
});

//DELETE over a collection
app.delete(baseURL+"/books", function(req,res){
    console.log("INFO: New DELETE request to /books");
    db.remove({},{},function(err,bookRem){
        if(err){
            console.error('WARNING: Error removing data from DB');
            res.sendStatus(500);
        }else{
            if(bookRem.result.n > 0){
                console.log("INFO: All the books (" + bookRem.result.n + ") have been succesfully deleted, sending 204...");
                res.sendStatus(204);
            }else{
                console.log("WARNING: There are no books to delete");
                res.sendStatus(404);   
            }
        }
    });
});

// GET a single resource
app.get(baseURL+"/books/:idBooks", function(req,res){
    var idBooks = req.params.idBooks;
    if(!idBooks){
        console.log("WARNING: New GET request to /books/:idBooks without idBooks, sending 400...");
        res.sendStatus(400);
    }else{
        console.log("INFO: New GET request to /books/" + idBooks);
        db.findOne({"idBooks" : idBooks}, function(err,book){
            if(err){
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500);
            }else{
                if(book){
                    console.log("INFO: Sending book: " + JSON.stringify(book, 2, null));
                    res.send(book);
                }else{
                    console.log("WARNING: There are not any book with idBooks: " + idBooks);
                    res.sendStatus(404);
                }
            }
        });
    }
});

//PUT over a single resource
app.put(baseURL+"/books/:idBooks", function(req,res){
    var updateBook = req.body;
    var idBooks = req.params.idBooks;
    
    if(!updateBook){
        console.log("WARNING: New PUT request to /books/ without book, sending 400...");
        res.sendStatus(400);
    }else{
        console.log("INFO: New PUT request to /books/" + idBooks + " with data " + JSON.stringify(updateBook, 2, null));
        if(!updateBook.author || !updateBook.title || !updateBook.publisher || !updateBook.year || !updateBook.idBooks){
            console.log("WARNING: The book " + JSON.stringify(updateBook, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422);
        }else{
            db.findOne({},function(err,books){
                if(err){
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500);
                }else{
                    if(books){
                        db.update({"idBooks": idBooks}, updateBook);
                        console.log("INFO: Modifying book with idBooks " + idBooks + " with data " + JSON.stringify(updateBook, 2, null));
                        res.send(updateBook);
                    }else{
                        console.log("WARNING: There are not any book with idBooks " + idBooks);
                        res.sendStatus(404);
                    }
                }
            });
        }
    }
});

//DELETE over a single resource
app.delete(baseURL+"/books/:idBooks", function(req,res){
    var idBooks = req.params.idBooks;
    
    if(!idBooks){
        console.log("WARNING: New DELETE request to /books/:idBooks without idBooks, sending 400...");
        res.sendStatus(400);
    }else{
        console.log("INFO: New DELETE request to /books/" + idBooks);
        db.remove({idBooks:idBooks},{},function(err,bookRem){
            if(err){
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500);
            }else{
                console.log("INFO: Books removed: " + bookRem.result.n);
                if(bookRem.result.n === 1){
                    res.sendStatus(204);
                    console.log("INFO: The book with idBooks " + idBooks + " has been succesfully deleted, sending 204...");
                }else{
                    console.log("WARNING: There are no books to delete");
                    res.sendStatus(404);
                }
            }
        });
    }
});

//POST over a single resource
app.post(baseURL+"/books/:idBooks", function (request, response) {
    var idBooks = request.params.idBooks;
    console.log("WARNING: New POST request to /books/" + idBooks + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(baseURL+"/books", function (request, response) {
    console.log("WARNING: New PUT request to /books, sending 405...");
    response.sendStatus(405); // method not allowed
});



app.listen(process.env.PORT);
