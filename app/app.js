//imports
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
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

const tasteRoutes = require('./api/routes/taste');
const userRoutes = require('./api/routes/user');
const UserListRoutes = require('./api/routes/userList');

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
app.use('/userList', UserListRoutes);



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
      }));
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
                console.log(body);
            });

            var options1 = {
                url: 'https://api.spotify.com/v1/me/',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
        

            request.get(options1, function(error, response, body) {
                    console.log(body.display_name);
                    user.name = body.display_name;
                    user.uri = body.uri;
                    useruri = body.uri;
                   /* for (var i = 0; i < body.items.length; i++){
                        var user = this.user({
                            artists: body.items[i].name,
                            artists.artists_uri: body.items[i].uri
                        })   
                        
                    } */
                   // user.save();
            });

            var optionsA = {
                url: 'https://api.spotify.com/v1/me/top/artists',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            }; 

            request.get(optionsA, function(error, response, body) {
                    console.log(body.items[1].name);
                    for (var i = 0; i < body.items.length; i++){
                        user.artist_name[i] = body.items[i].name;
                        user.artist_uri[i] = body.items[i].uri;       
                    }
                    
                    User.find()
                    .select('uri')
                    .exec()
                    .then(
                        userList = new UserList({
                        _id: new mongoose.Types.ObjectId(),
                        uri: useruri
                        })
                    )   
                    userList.save();
                    user.save();
                    //} 

               
                
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

 


/*
app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});*/

module.exports = app;
