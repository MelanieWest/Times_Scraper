const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
var app = express();


require("./controllers/gooseRoutes")(app);

var PORT = process.env.PORT ||3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


const exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");

//require("./controllers/mongojsRoutes")(app);

app.listen(PORT, function(){
    console.log("App listening on PORT: "+PORT);
});


