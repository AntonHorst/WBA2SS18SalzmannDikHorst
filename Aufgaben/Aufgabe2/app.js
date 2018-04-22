var fs = require('fs');
var filename = __dirname+'/staedte.json';



var promise1 = new Promise(function(resolve, reject) {
  fs.readFile(__dirname+'/staedte.json','utf8',(err,data) => {
    var jsonobj1 = JSON.parse(data);
    if(err){
      reject(console.log('asduabsdad'));
    }else{
      resolve(jsonobj1.cities);
    }
  }
)})

var promise2 = new Promise(function(resolve, reject) {
  fs.readFile(__dirname+'/mehr_staedte.json','utf8',(err,data) => {
    var jsonobj2 = JSON.parse(data);
    if(err){
      reject(console.log('asduabsdad'));
    }else{
      resolve(jsonobj2.cities);
    }
  }
)})

var ausgabe = Promise.all([promise1, promise2]).then(function(fullfilled) {
	console.log(fullfilled);
})
.catch(function(error) {
	// One or more promises was rejected
});

/*var ausgabe = function(){
  promise1
  .then(function (fullfilled){
    console.log(fullfilled);
  })
  .catch(function (error){

    console.log('basdbuazsbd');
  });
};
ausgabe();*/
