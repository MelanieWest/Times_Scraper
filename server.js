const express = require("express");
const bodyParser = require("body-parser");

var app = express();

var PORT = process.env.PORT ||3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//require my controllers files,
//which in turn will require the models
//files

require("./controllers/apiroutes")(app);
// require("./controllers/htmlroutes");


const exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");


app.listen(PORT, function(){
    console.log("App listening on PORT: "+PORT);
});


