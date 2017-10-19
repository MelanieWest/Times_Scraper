module.exports = function (app) {

    const request = require("request");
    const cheerio = require("cheerio");
    var axios = require("axios");

    const mongojs = require("mongojs");
    // const mongoose  = require("mongoose");
    // var Article = require("../models/Articles.js");
    // var Note = require("../models/Notes.js");      
    
    //database configuration
    var databaseUrl = "scraper";
    var collections = ["NewYorkTimes", "yCombinator"];

    //Hook mongojs to database
    var db = mongojs(databaseUrl, collections);

    db.on("error", function (error) {
        console.log("Database error: ", error);
    });


    //test the home page.  No functionality yet
    // app.get("/", function (req, res) {
    //     res.send("Hello World");
    // });


    //if data is in the database, display it on the page
    // (database info has not yet been adjusted for mongoose)

    app.get("/", function(req, res) {
                 
         db.NewYorkTimes.find({}, function (error, found) {
            if (error) {
                console.log(error);
            }
            else {
                res.render("index",{data: found});
            }
        });
        
      });



// //this is really the same as the "/" path

    // app.get("/all", function (req, res) {
    //     db.NewYorkTimes.find({}, function (error, found) {
    //         if (error) {
    //             console.log(error);
    //         }
    //         else {
    //             res.json(found);
    //         }
    //     });

        // db.yCombinator.find({},function(error,found){
        //     if(error){
        //         console.log(error);
        //     }
        //     else{
        //         res.json(found);
        //     }
        // });

    //});



    //this needs to be run first, to acquire the data to be stored

    app.get("/nyt", function (req, res) {

        //axios.get("https://www.nytimes.com").then(function(response){})        

        request("https://www.nytimes.com", function (error, response, html) {

            var $ = cheerio.load(html);


            // var results = {};

            // result.title = $(this).children("a").text();
            // result.link  = $(this).children("a").attr("href");

            // db.Article.create(result).then(function(dbArticle){    
            //     res.sent("Scrape Complete");              
            // })
            // .catch(function(err){
            //     res.json(err);
            // });


            var results = []
            $("h2.story-heading").each(function (i, element) {
                var link = $(element).find("a").attr("href");
                var title = $(element).find("a").text();

                console.log('found an h2');
                if (title && link) {
                    db.NewYorkTimes.insert({
                        link: link,
                        title: title
                    },
                        function (err, saved) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(saved);
                            }
                        });
                };
            });

     });
    });

//this scrape is done using mongojs method -
//maybe not currently usable?

    // app.get("/ycomb", function (req, res) {
    //     request("https://news.ycombinator.com/", function (error, response, html) {
    //         var $ = cheerio.load(html);
    //         $(".title").each(function (i, element) {
    //             var title = $(this).children("a").text();
    //             var link = $(this).children("a").attr("href");
    //             if (title && link) {
    //                 db.yCombinator.save({
    //                     title: title,
    //                     link: link
    //                 },
    //                     function (err, saved) {
    //                         if (err) {
    //                             console.log(err);
    //                         }
    //                         else {
    //                             console.log(saved);
    //                         }
    //                     });
    //             };
    //         })

    //     });

    //     res.send("scrape complete");
    // });


    // app.post('/update/:id', (request, response) => {
    //     let updateID = parseInt(request.params.id);
    //     if (isNaN(updateID)) {
    //       //Handle invalid IDs, we only want integers.  This shouldn't ever happen
    //       response.send("I really don't know how you accomplished this, but you have selected an invalid ID. Impressive, but it won't work ");
    //     }       
    //     db.NewYorkTimes.update({})
    //         console.log('update');
      
    //         response.redirect('/')
            
    //       });
    

};  //end of module exports