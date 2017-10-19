const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var app = express();

//local mongo db nytPopulator
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/nytPopulator",{
    useMongoClient: true
});

var PORT = process.env.PORT ||3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//use this next line if I decide to use a normal
// index.html page instead of handlebars:

//app.use(express.static("public"));

// use handlebars at a later date:
const exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");

require("./controllers/mongojsRoutes")(app);
var Article = require("./models/Articles.js");
var Note = require("./models/Notes.js");      
// require("./controllers/gooseRoutes");

app.listen(PORT, function(){
    console.log("App listening on PORT: "+PORT);
});


