
/*var array1 = [6,9];

function sortieren(){
  array1.sort();
  console.log(array1);
}


function compareNumbers(a,b){
  return a-b;
}

let array2 = [8,6];

array1.sort(compareNumbers);
console.log(array2);*/

//var id = 384573268;
id => {
        return fetch("https://api.twitter.com/user"+id )
              .then(response=> {
                    return JSON.parse(response);
              }).then(response=> {
                      return response.data;
              }).then(tweets => {
                  return tweets.filter(tweet => {
                          return tweet.stars > 50
                    })
              }).then(tweets => {
                      return tweets.filter(tweet => {
                        return tweet.rts > 50
                      })
              })
}
