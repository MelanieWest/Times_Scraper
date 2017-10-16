const express = require("express");
const bodyParser = require("body-parser");
const req = require("request");
const cheer = require("cheerio");

var app = express();

var PORT = process.env.PORT ||3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");

//require my controllers files,
//which in turn will require the models
//files

app.listen(PORT, function(){
    console.log("App listening on PORT: "+PORT);
});