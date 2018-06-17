var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listWetter', function (req, res) {
   fs.readFile( __dirname + "/" + "wetter.json", 'utf8', function (err, data) {
     var weather = JSON.parse(data);
     var nachricht = `Es ist ${weather.main.temp} Grad in ${weather.name}!`;
       console.log( nachricht );
       res.end( nachricht );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server app listening at http://%s:%s", host, port)

})
