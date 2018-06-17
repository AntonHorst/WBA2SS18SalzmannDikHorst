var fs = require('fs');
const request = require('request');
let apiKey = '98f8e2d126414ef372e676b3910a139d';
let city = 'portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
  }
  fs.writeFile(__dirname+'/wetter.json',body,function(err) {
    if(err) return console.error(err);

  })
});
