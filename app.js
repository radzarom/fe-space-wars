var express = require("express");
var app     = express();
var path    = require("path");


app.use(express.static('build'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

console.log("Running at Port 3000");

