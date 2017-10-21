module.exports = function(app){

     const request = require("request");
     const cheerio = require("cheerio");
    // const express = require("express");
    // var app = express();
    
    var axios = require("axios");
    
    const mongoose  = require("mongoose");

    var db = require("../models");
    var Article =require("../models/Articles");
    var Note = require("../models/Notes");

 
    
        //local mongo db nytPopulator
    mongoose.Promise = Promise;
    mongoose.connect("mongodb://heroku_qk3bhr4k:lco9fc9ms9ktuo8mfaumndsjv7@ds227565.mlab.com:27565/heroku_qk3bhr4k"{
    //mongoose.connect("mongodb://localhost/nytPopulator",{
        useMongoClient: true
    });
    


    app.get("/nyt", function(req, res) {
      // First, we grab the body of the html with request
      request("http://www.nytimes.com/",function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
    
        // Now, we grab every h2 within an article tag, and do the following:
        $("h2.story-heading").each(function(i, element) {
    
          var link = $(element).find("a").attr("href");
          var title = $(element).find("a").text();
    
          console.log('found an h2');
          if (title && link) {
              db.Article.create({
                  link: link,
                  title: title
              }).then(function(dbArticle){
                res.send("scrape complete");
              }).catch(function(err){
                res.json(err);
              })
              
          };
          });
        });
        console.log("scrape complete");
      });

// route for displaying Articles database using handlebars

      app.get("/", function(req, res) {
        
        db.Article.find({}).then(function(dbArticle) {
          res.render("index",{data: dbArticle});
        }).catch(function(err){
          res.json(err);
        });

      });

  

// Route for getting all Articles from the db & displaying as JSON

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article
      .find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note
      .create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  


};      //end of module.exports
