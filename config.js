// This file handles the configuration of the app.
// It is required by app.js

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');


module.exports = function(app, io) {

    // Set .html as the default template extension
    app.set('view engine', 'ejs');

    // Initialize the ejs template engine
    app.engine('html', require('ejs').renderFile);

    // Tell express where it can find the templates
    app.set('views', __dirname + '/views');

    // Make the files in the public folder available to the world
    app.use(express.static(__dirname + '/public'));
    app.use('/bower_components', express.static(__dirname + '/bower_components'));

    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    app.use(session({ resave: true, saveUninitialized: true, secret: 'keyboard cat', cookie: {maxAge: 60000} }));

    // passport
    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(password)) { return done(null, false); }
          return done(null, user);
        });
      }
    ));
    
    app.use(passport.initialize());
    app.use(passport.session());

};
