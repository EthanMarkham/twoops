import express from 'express'
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import HTTP from 'http'

import { SocketAPI } from './modules/webSocket'
import { TwitchBot } from './modules/twitchBot'
import { App } from '../client/app'
import { MongoAPI } from './modules/mongoApi'
import { GameManager } from './modules/gameManager/types'

require('dotenv').config()

const server = express()
const http = new HTTP.Server(server);
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.json());
server.use('/', express.static(path.join(__dirname, 'static')))
server.use(express.urlencoded({ extended: true }));
//SERVICES 

//db connection
const mongoAPI: MongoAPI = require('./modules/mongoApi');
mongoAPI.init();

//websocket
const socketAPI: SocketAPI = require('./modules/webSocket');
socketAPI.init(http);

//twitchbot
const twitchBot: TwitchBot = require('./modules/twitchBot');
twitchBot.init();

//GAME MANAGER
const gameManager: GameManager = require('./modules/gameManager');
gameManager.addListeners();

//TWITCH AUTH
server.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
server.use(passport.initialize());
server.use(passport.session());

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function (accessToken: string, done: any) {
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': process.env.BOT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error: any, response: any, body: any) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
}

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});

const callbackURL = process.env.SERVER_URL + "/auth/twitch/callback";
console.log(callbackURL);

passport.use('twitch', new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: process.env.BOT_ID,
  clientSecret: process.env.BOT_SECRET,
  callbackURL: callbackURL,
  state: true
},
  function (accessToken: string, refreshToken: string, profile: any, done: any) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // Securely store user profile in your DB
    //User.findOrCreate(..., function(err, user) {
    //  done(err, user);
    //});

    done(null, profile);
  }
));

// Set route to start OAuth link, this is where you define scopes to request
server.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

// Set route for OAuth redirect
server.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

//API
const apiRouter = require('./routes/game');
server.use('/api', apiRouter);


//VIEW RENDERS
const manifest = fs.readFileSync(
  path.join(__dirname, 'static/manifest.json'),
  'utf-8'
);
const assets = JSON.parse(manifest);

server.get('/', (req: any, res: any) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    if (!req.session.passport.user.data[0].login) throw new Error("No twitch username found");
    const component = ReactDOMServer.renderToString(React.createElement(App));
    res.render('client', { assets, component })
  }
  else res.render('login');
});

http.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.PORT || 3000}`)
})