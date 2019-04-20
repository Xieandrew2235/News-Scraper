//DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongojs = require("mongojs");

//Scraping Models
var request = require("request");
var cheerio = require("cheerio");

//Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://heroku_8prtxlbx:dqks82qio0tsmdl892otjj7e84@ds133084.mlab.com:33084/heroku_8prtxlbx");
var db = mongoose.connection;

// If there is an error connecting to mongoose, console log errior
db.on("error", function (error) {
    console.log(error);
})
db.once("open", function () {
    console.log("Mongoose connection success.");
});

// Routes
// Scrape route
app.get("/scrape", function (req, res) {
    request("https://www.coindesk.com", function (error, response, html) {
        var $ = cheerio.load(html);
        $('h3, #content').each(function (i, element) {
            var result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");
            var entry = new Article(result);
            entry.save(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });

        });
    });
    res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

// Grab an article by ObjectId
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, query finds the matching ID in our db and populate all of the notes associated with it
    Article.findOne({ "_id": req.params.id })
        .populate("note")
        .exec(function (error, doc) {
            // Log any errors, otherwise send to browser as JSON object
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
});


// Post route that creates new note/updates
app.post("/articles/:id", function (req, res) {
 // Create a new note and pass the req.body to the entry, then save the new note
 var newNote = new Note(req.body);

 newNote.save(function(error, doc) {
// If error then console log error, otherwise search by article ID and update note
   if (error) {
     console.log(error);
   }
   else {
     Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
     // Execute the above query
     .exec(function(err, doc) {
       // Console log errors; if no errors then send document to the browser
       if (err) {
         console.log(err);
       }
       else {
         res.send(doc);
       }
     });
   }
 });
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on" +  port);
