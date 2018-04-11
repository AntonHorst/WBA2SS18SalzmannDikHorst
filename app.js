var fs = require('fs')
fs.readFile(__dirname+"/staedte.json", 'utf8', (err, data) => {
  if (err) {
    console.log("Fehler beim Laden der Dateien")
  } else {
  var jsonobj = JSON.parse(data);
  //console.log(jsonobj.cities[0].population);

}
for(var i=0;i < data.length; i++){
console.log("\n name:"+jsonobj.cities[i].name+"\n","country:"+jsonobj.cities[i].country+"\n","population:"+jsonobj.cities[i].population+"\n");
}
});
