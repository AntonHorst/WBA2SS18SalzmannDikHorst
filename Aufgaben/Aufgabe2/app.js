var fs = require('fs');
var concat =require('array-concat');
fs.readFile(__dirname+'/staedte.json','utf8',(err,data1) => {
  fs.readFile(__dirname+'/mehr_staedte.json','utf8',(err,data2) => {
      var zusammen = data1.concat(data2);
      console.log(JSON.parse(zusammen));
  })
})
