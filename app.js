var fs = require('fs')
const chalk = require('chalk');
function compareNumbers(a,b){
  return a.population-b.population;
}



fs.readFile(__dirname+'/staedte.json','utf8',(err,data) => {
  var jsonobj = JSON.parse(data);

  jsonobj.cities.sort(compareNumbers);
  var string = JSON.stringify(jsonobj, null, 2);


  fs.writeFile(__dirname+'/staedte_sortiert.json',string,function(err) {
    if(err) return console.error(err);

    for(var i=0;i < data.length; i++){
    console.log("\n name:"+chalk.blue(jsonobj.cities[i].name)+"\n",
    "country:"+chalk.red(jsonobj.cities[i].country)+"\n",
    "population:"+chalk.green(jsonobj.cities[i].population)+"\n");
    }
  })
})
