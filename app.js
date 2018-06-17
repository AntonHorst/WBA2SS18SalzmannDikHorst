'use strict';

const http = require('http');

var url = 'http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=98f8e2d126414ef372e676b3910a139d'

const server = http.createServer(function(request, response){
  var request = require('request');
  request(url, function(err,res, body){
    var data = JSON.parse(body);
    var message = `Es sind ${data.main.temp}Celsius in ${data.name}!`;
//    var message2 = `${data.main.temp - 273}`;
    console.log(message);
//    console.log(message2);
    response.write(message);
    response.end();
  });
})

server.listen(3000);
