var fs = require('fs')
const chalk = require('chalk');
fs.readFile(__dirname+"/staedte.json", 'utf8', (err, data) => {
  if (err) {
    console.log("Fehler beim Laden der Dateien")
  } else {
  var jsonobj = JSON.parse(data);
}
for(var i=0;i < data.length; i++){
console.log("\n name:"+chalk.blue(jsonobj.cities[i].name)+"\n",
"country:"+chalk.red(jsonobj.cities[i].country)+"\n",
"population:"+chalk.green(jsonobj.cities[i].population)+"\n");
}

});
