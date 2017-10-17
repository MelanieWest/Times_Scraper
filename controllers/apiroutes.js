module.exports = function (app) {

    const request = require("request");
    const cheerio = require("cheerio");

    const mongojs = require("mongojs");

    //database configuration
    var databaseUrl = "scraper";
    var collections = ["NewYorkTimes", "yCombinator"];

    //Hook mongojs to database
    var db = mongojs(databaseUrl, collections);
    db.on("error", function (error) {
        console.log("Database error: ", error);
    });


    //test the home page.  No functionality yet
    app.get("/", function (req, res) {
        res.send("Hello World");
    });

    app.get("/all", function (req, res) {
        db.NewYorkTimes.find({}, function (error, found) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(found);
            }
        });

        // db.yCombinator.find({},function(error,found){
        //     if(error){
        //         console.log(error);
        //     }
        //     else{
        //         res.json(found);
        //     }
        // });

    });




    app.get("/nyt", function (req, res) {

        request("https://www.nytimes.com", function (error, response, html) {

            var $ = cheerio.load(html);
            var results = [];

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
        res.send('news scrape complete')
        //res.json(render);
    });




    app.get("/ycomb", function (req, res) {
        request("https://news.ycombinator.com/", function (error, response, html) {
            var $ = cheerio.load(html);
            $(".title").each(function (i, element) {
                var title = $(this).children("a").text();
                var link = $(this).children("a").attr("href");
                if (title && link) {
                    db.yCombinator.save({
                        title: title,
                        link: link
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
            })

        });

        res.send("scrape complete");
    });

};  //end of module exports