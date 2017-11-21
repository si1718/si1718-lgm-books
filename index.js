var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;

var mdbURL = "mongodb://djluis:djluis@ds149855.mlab.com:49855/si1718-lgm-books";

var app = express();

app.use(bodyParser.json());

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
    db.find({}).toArray((err,books) => {
        if(err){
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500);
        }else{
            console.log("INFO: Sending books: " + JSON.stringify(books, 2, null));
            res.send(books);
        }
    });
});

//POST over a collection
app.post(baseURL+"/books", function(req,res){
    var newBook = req.body;
    
    if(!newBook){
        console.log("WARNING: New POST request to /books/ without book, sending 400...");
        res.sendStatus(400);
    }else{
        if(!newBook.idAuthor || !newBook.idTitle || !newBook.idPublisher || !newBook.idYear || !newBook.idIsbn){
            console.log("WARNING: The book: " + JSON.stringify(newBook, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422);
        }else{
            db.findOne({idIsbn:newBook.idIsbn},function(err,book){
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
app.get(baseURL+"/books/:idIsbn", function(req,res){
    var idIsbn = req.params.idIsbn;
    if(!idIsbn){
        console.log("WARNING: New GET request to /books/:idIsbn without idIsbn, sending 400...");
        res.sendStatus(400);
    }else{
        console.log("INFO: New GET request to /books/" + idIsbn);
        db.findOne({"idIsbn" : idIsbn}, function(err,book){
            if(err){
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500);
            }else{
                if(book){
                    console.log("INFO: Sending contact: " + JSON.stringify(book, 2, null));
                    res.send(book);
                }else{
                    console.log("WARNING: There are not any book with idIsbn: " + idIsbn);
                    res.sendStatus(404);
                }
            }
        });
    }
});

//PUT over a single resource
app.put(baseURL+"/books/:idIsbn", function(req,res){
    var updateBook = req.body;
    var idIsbn = req.params.idIsbn;
    
    if(!updateBook){
        console.log("WARNING: New PUT request to /books/ without book, sending 400...");
        res.sendStatus(400);
    }else{
        console.log("INFO: New PUT request to /books/" + idIsbn + " with data " + JSON.stringify(updateBook, 2, null));
        if(!updateBook.idAuthor || !updateBook.idTitle || !updateBook.idPublisher || !updateBook.idYear || !updateBook.idIsbn){
            console.log("WARNING: The book " + JSON.stringify(updateBook, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422);
        }else{
            db.findOne({},function(err,books){
                if(err){
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500);
                }else{
                    if(books){
                        db.update({"idIsbn": idIsbn}, updateBook);
                        console.log("INFO: Modifying book with idIsbn " + idIsbn + " with data " + JSON.stringify(updateBook, 2, null));
                        res.send(updateBook);
                    }else{
                        console.log("WARNING: There are not any book with idIsbn " + idIsbn);
                        res.sendStatus(404);
                    }
                }
            });
        }
    }
});

//DELETE over a single resource
app.delete(baseURL+"/books/:idIsbn", function(req,res){
    var idIsbn = req.params.idIsbn;
    
    if(!idIsbn){
        console.log("WARNING: New DELETE request to /books/:idIsbn without idIsbn, sending 400...");
        res.sendStatus(400);
    }else{
        console.log("INFO: New DELETE request to /books/" + idIsbn);
        db.remove({idIsbn:idIsbn},{},function(err,bookRem){
            if(err){
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500);
            }else{
                console.log("INFO: Books removed: " + bookRem.result.n);
                if(bookRem.result.n === 1){
                    res.sendStatus(204);
                    console.log("INFO: The book with idIsbn " + idIsbn + " has been succesfully deleted, sending 204...");
                }else{
                    console.log("WARNING: There are no books to delete");
                    res.sendStatus(404);
                }
            }
        });
    }
});

//POST over a single resource
app.post(baseURL+"/books/:idIsbn", function (request, response) {
    var idIsbn = request.params.idIsbn;
    console.log("WARNING: New POST request to /books/" + idIsbn + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(baseURL+"/books", function (request, response) {
    console.log("WARNING: New PUT request to /books, sending 405...");
    response.sendStatus(405); // method not allowed
});

app.listen(process.env.PORT);
