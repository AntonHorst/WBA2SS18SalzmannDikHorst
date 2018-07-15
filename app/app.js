//imports
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
var SpotifyWebApi = require('spotify-web-api-node');
var cookieParser = require('cookie-parser');
const queryString = require('query-string');
var querystring = require('querystring');
var request = require('request'); // "Request" library
var useruri = '';

//Schema Import
var Taste = require("./api/models/taste");
var User = require("./api/models/user");
var UserList = require("./api/models/userList");
var TasteScore = require("./api/models/tasteScore");

//routes Import
const tasteRoutes = require('./api/routes/taste');
const userRoutes = require('./api/routes/user');
const userListRoutes = require('./api/routes/userList');
const tasteScoreRoutes = require('./api/routes/tasteScore');

// Use npm packages
app.use(morgan('dev')); //monitoring 
app.use(bodyParser.urlencoded({extended: false})); //bodyparser
app.use(bodyParser.json());

//mongoose init
mongoose.connect('mongodb://admin:admin@locafy-shard-00-00-aw6ai.mongodb.net:27017,locafy-shard-00-01-aw6ai.mongodb.net:27017,locafy-shard-00-02-aw6ai.mongodb.net:27017/test?ssl=true&replicaSet=Locafy-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use((req, res, next) => {   
    //protection '*' allows all
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/taste', tasteRoutes);
app.use('/user', userRoutes);
app.use('/userList', userListRoutes);
app.use('/tasteScore', tasteScoreRoutes);



//spotify web api init

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

var client_id  = 'b1c8b493b0604ce58ed5e5f28c3130a9';
var client_secret = 'faa8849ed7a7466f8009e23dc8f86dc8';
var redirect_uri = 'http://localhost:3000/callback';

var spoturi = '';

var spotifyApi = new SpotifyWebApi({
    client_id,
    client_secret,
    redirect_uri
});

var stateKey = 'spotify_auth_state';
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());



app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-top-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
    );



  });

app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    var user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: '',
        uri: '',
        artist_name: [20],
        artist_uri: [20]
        }
    );
    var useruri = '';
  
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
            error: 'state_mismatch'
            })
        );
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
            },
            headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
            var access_token = body.access_token,
            refresh_token = body.refresh_token;

            var access_token = body.access_token,
            refresh_token = body.refresh_token;

            var options2 = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options2, function(error, response, body) {
                //console.log(body);
            });

            var options1 = {
                url: 'https://api.spotify.com/v1/me/',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
        

            request.get(options1, function(error, response, body) {
                    user.name = body.display_name;
                    user.uri = body.uri;
                    useruri = body.uri;

            });

            var optionsA = {
                url: 'https://api.spotify.com/v1/me/top/artists',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            }; 

            request.get(optionsA, function(error, response, body) {
                // console.log(body.items[1].name);
                for (var i = 0; i < body.items.length; i++){
                    user.artist_name[i] = body.items[i].name;
                    user.artist_uri[i] = body.items[i].uri;       
                }
            
                User.find({uri : user.uri}, function (err, docs) {
                    if (docs.length){
                        console.log('User ' + user.uri + ' exists already');
                    }else{
                        user.save(function(err){
                            console.log(err,user);
                        });
                    }
                });
            });
            res.redirect('/#' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                })
            );
        } else {
            res.redirect('/#' +
            querystring.stringify({
                error: 'invalid_token'
            })
        );
        }
    });
    }
    
});
  
  app.get('/refresh_token', function(req, res) {
  
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
});

app.get('/alluser', function(req, res){
    User.find({}, 'artist_uri name',  function(err, docs){
        for (var i = 0; i < docs.length; i++){
           for (var j = 0; j < docs[i].artist_uri.length; j++){ 
            console.log(docs[i].artist_uri[j]);
           }
        console.log(docs[i].name);   
        }  
       // console.log(docs);
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User List',
        });
    })
    .catch(err =>{
        console.og(err);
        res.status(500).json({error: err});
    });
});

app.get('/tastescores', function(req, res){
    User.find().select('name uri artist_uri artist_name')
    .exec()
    .then(docs =>{
        
        for (var i = 0; i < docs.length; i++){
            //user 1
            for (var j = 0; j < docs.length; j++){
                //user 2 mit 1 vergleichen
                var tasteScore = new TasteScore({
                    _id: new mongoose.Types.ObjectId(),
                    useruri1: docs[i].uri,
                    useruri2: docs[j].uri,
                    score   : "0",
                    artists_name: [20],
                    artists_uri: [20]
                })
                var counter = 0;
                for (var k = 0; k < docs[i].artist_uri.length; k++){
                    //artist 1
                    for (var l = 0; l < docs[i].artist_uri.length; l++){
                        //artist 2 mit 1 vergleichen
                        if(docs[i].artist_uri[k] === docs[j].artist_uri[l] && docs[i].uri !== docs[j].uri){
                            
                            tasteScore.artists_name[counter] = docs[i].artist_name[k];
                            tasteScore.artists_uri[counter] = docs[i].artist_uri[k];
                            tasteScore.score+=0.5;

                            console.log("User1:" + docs[i].name);
                            console.log("Artist1:" + docs[i].artist_name[k]);
                            console.log("User2:" + docs[j].name);
                            console.log("Artist2:" + docs[j].artist_name[l]);
                            counter++;
                        }
                    }
                }
                if(tasteScore.useruri1 === tasteScore.useruri2){
                    console.log('User 1 ist User 2');
                } else {

                    tasteScore.save(function(err){
                        console.log(err,tasteScore);
                    });
                }
            }
        }

        TasteScore.find().select('_id useruri1 useruri2')
            .exec()
            .then(docs => {
                for (var i = 0; i < docs.length; i++){
                    var counter = 0;
                    for (var j = 0; j < docs.length; j++){
                        if (docs[i].useruri1 === docs[j].useruri1 && docs[i].useruri2 === docs[j].useruri2){
                            counter ++;
                        }
                    console.log('Zeile 331 ' + counter);
                    }
                    if (counter !== 0){
                        var deleteID = docs[i]._id;
                        TasteScore.remove({_id: deleteID}).exec();
                    } else {
                        console.log('kein Nutzer wurde gelöscht');
                    }
                }
            })
        res.status(200).json({
            message: 'TasteScores Saved',
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = app;
