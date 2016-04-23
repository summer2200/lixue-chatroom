// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar'),
    assert = require('assert');
var UserItem = require('./models/userItem');
var GroupItem = require('./models/groupItem');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');
var dateFormat = require('dateformat');
var _ = require('underscore');
// Export a function, so that we can pass
// the app and io instances from the app.js file:

module.exports = function(app, io) {

    app.get('/', function(req, res) {

        // Render views/home.ejs
        res.render('home');
    });

    app.get('/create', function(req, res) {

        // Generate unique id for the room
        var id = Math.round((Math.random() * 1000000));

        // Redirect to the random room
        res.redirect('/chat/' + id);
    });

    app.get('/sign-in', function(req, res) {
        res.render('signIn', { msg: '', title:'Sign In' });
    });

    app.post('/sign-in', urlencodedParser, function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        // res.send('welcome, ' + req.body.username)
        var email = req.body.email;
        var password = req.body.password;

        // var username = req.body.username;
        UserItem.findOne({ email: email, password: password }, function(err, result) {
            if (result) {
                res.cookie('username', result.name);
                res.cookie('userId', result._id);
                console.log(res.cookie['username'])
                res.redirect('/personal-page');
                // res.write(req.cookie[username]);

            } else {
                res.render('signIn', { msg: 'user email or password error' });
            }
        });

    });

    app.post('/add-friend', function(req, res){
        var userInfo = req.body.userInfo;
        // UserItem.update({name: name}, {friends: []}, function(err, numberAffected, rawResponse){

        // })
        var currentName = req.cookies.username;
        console.log(currentName);
        // currentName = 'zhang'
        if(currentName === undefined) {
            res.json('sign-in');
            return;
        }
        UserItem.findOne({name: currentName}, function(err, result){
            if(typeof(result['friends']) == 'undefined'){
                result.friends = [];
            }
            // console.log(userInfo)
            result.friends.push(userInfo);
            result.save(function(err){
                if(!err){
                    res.status(200).json('success');
                }
            });
        });
    });

    app.delete('/delete-friend', function(req, res){
        var friendId = req.body.friendId;
        var currentName = req.cookies.username;
        console.log(currentName);
        // currentName = 'zhang'
        if(currentName == undefined) {
            res.json('sign-in');
            return;
        }
        UserItem.findOne({name: currentName}, function(err, result){
            if(typeof(result['friends']) == 'undefined'){
                result.friends = [];
            }
            console.log(friendId)
            var index = _.findIndex(result.friends,{id: friendId});
            console.log(index)
            if(index > -1) result.friends.splice(index, 1);
            result.save(function(err){
                if(!err){
                    res.status(200).json('success');
                }
            });
        });
    });

    app.post('/my-friends', function(req, res){
        var currentName = req.cookies.username;
        console.log(currentName);
        // currentName = 'zhang'
        if(currentName === undefined) {
            res.json('sign-in');
            return;
        }
        UserItem.findOne({name: currentName}, function(err, result){
            if(typeof(result.friends) == 'undefined'){
                result.friends = [];
            }

            res.status(200).json(result.friends);
        });
    });

    app.get('/personal-page', function(req, res) {
        var now = new Date();
        var date = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        console.log("Cookies: ", req.cookies);
        res.render('personalPage', { userName: req.cookies.username, date: date});
    });


    app.post('/sign-up', function(req, res) {
        // res.render('signUp', {up:'success'});
        var userItem = new UserItem();
        var body = req.body;
        console.log(body)
        Object.keys(body).forEach(function(key) {
            userItem[key.replace('[]', '')] = body[key];
        });
        userItem.save(function(err, doc) {
            if (err) {
                res.json({ status: err });
            } else {
                res.redirect('/sign-in');
            }
        });
    });

    app.get('/sign-up', function(req, res) {
        res.render('signUp');
    });


    app.get('/p2p-chat/:friendName', function(req, res) {
        res.render('p2pChat', {friend:{name:req.params.friendName}});
    });


    app.get('/chat/:id', function(req, res) {

        // Render the chant.html view
        res.render('chat');
    });

    //sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
    // app.post('/local-reg', passport.authenticate('local-signup', {
    //     successRedirect: '/',
    //     failureRedirect: '/signin'
    // }));

    // //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
    // app.post('/login', passport.authenticate('local-signin', {
    //     successRedirect: '/',
    //     failureRedirect: '/signin'
    // }));

    //logs user out of site, deleting them from the session, and returns to homepage
    app.get('/logout', function(req, res) {
        var name = req.cookies.username;
        console.log("LOGGIN OUT " + name);
        req.logout();
        res.redirect('/');
    });
};

