var fs = require('fs');
var filename = __dirname+'/staedte.json';
const chalk = require('chalk');



var promise1 = new Promise(function(resolve, reject) {
  fs.readFile(__dirname+'/staedte.json','utf8',(err,data) => {
    var jsonobj1 = JSON.parse(data);
    if(err){
      reject(console.log('Ein Fehler ist beim Lesen der staedte.json aufgetreten.'));
    }else{
      resolve(jsonobj1.cities);
    }
  }
)})

var promise2 = new Promise(function(resolve, reject) {
  fs.readFile(__dirname+'/mehr_staedte.json','utf8',(err,data) => {
    var jsonobj2 = JSON.parse(data);
    if(err){
      reject(console.log('Ein Fehler ist beim Lesen der staedte_mehr.json aufgetreten.'));
    }else{
      resolve(jsonobj2.cities);
    }
  }
)})

Promise.all([promise1, promise2]).then(function(fullfilled) {
  for(var j =0; j<fullfilled.length; j++){
    for(var i=0; i<fullfilled[j].length; i++){
    //console.log(fullfilled[j][i]);
    console.log("\n name:"+chalk.blue(fullfilled[j][i].name)+"\n",
    "country:"+chalk.red(fullfilled[j][i].country)+"\n",
    "population:"+chalk.green(fullfilled[j][i].population)+"\n",
    "\n--------------------");
  }}
})
.catch(function(error) {
});

/*var ausgabe = function(){
  promise1
  .then(function (fullfilled){
    console.log(fullfilled);
  })
  .catch(function (error){

    console.log('test');
  });
};
ausgabe();*/
