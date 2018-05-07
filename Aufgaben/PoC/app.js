'use strict';

const http = require('http');

var url = 'http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22'

const server = http.createServer(function(request, response){
  var request = require('request');
  request(url, function(err,res, body){
    var data = JSON.parse(body);
    var message = `It's ${data.main.temp} degrees in ${data.name}!`;
    var message2 = `${data.main.temp - 273}`;
    console.log(message);
    console.log(message2);
    response.write(message);
    response.end();
  });
})

server.listen(3000);
