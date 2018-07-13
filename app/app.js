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

//Schema Import
var Taste = require("./api/models/taste");

const tasteRoutes = require('./api/routes/taste');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Use npm packages
app.use(morgan('dev')); //monitoring 
app.use(bodyParser.urlencoded({extended: false})); //bodyparser
app.use(bodyParser.json());

//mongoose init
mongoose.connect('mongodb://locafy_admin:' + process.env.MONGO_ATLAS_PW + '@locafy-shard-00-00-pe0eg.mongodb.net:27017,locafy-shard-00-01-pe0eg.mongodb.net:27017,locafy-shard-00-02-pe0eg.mongodb.net:27017/test?ssl=true&replicaSet=locafy-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });
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

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/taste', tasteRoutes);

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

var client_id  = 'eb2b82ced16343f28761059752b8a80a';
var client_secret = '35c86255623f4a75ab43100acf095996';
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

            var options = {
                url: 'https://api.spotify.com/v1/me/top/artists',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            request.get(options, function(error, response, body) {
                for (var i = 0; i < body.items.length; i++){
                    console.log(body.items[i].name);
                    var taste = new Taste({
                        _id: new mongoose.Types.ObjectId(),
                        name: body.items[i].name,
                        popularity: body.items[i].popularity
                    });
                    taste.save();
                }
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
