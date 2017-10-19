const express = require("express");
const bodyParser = require("body-parser");

var app = express();

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

require("./controllers/apiroutes")(app);
var Article = require("./models/Articles.js");
var Note = require("./models/Notes.js");      
// require("./controllers/htmlroutes");

app.listen(PORT, function(){
    console.log("App listening on PORT: "+PORT);
});


