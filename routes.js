// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar'),
    assert = require('assert');
var UserItem = require('./models/userItem');
var passport = require('passport');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
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
        res.render('signIn');
    });

    app.post('/sign-in', urlencodedParser, function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }
        // res.send('welcome, ' + req.body.username)
        var username = req.body.username;
        var password = req.body.password;
        UserItem.findOne({name: username, password:password},function (err,result) {
        	if(result){
        		res.redirect('/personal-page');
        	}else{
        		res.redirect('/sign-in');
        	}
        });

    });

    app.get('/personal-page', function(req, res) {
        res.render('personalPage');
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
        // insertDocument({name:'viki', password: '123', email:'ab@12.com'}, 'users', function(result){
        // res.redirect('/sign-in');
        // });

    });

    app.get('/sign-up', function(req, res) {
        res.render('signUp');
    });

    // app.get('/personal-page', function(req, res){
    // 	res.render('/personal-page');
    // });
    app.get('/create-group', function(req, res) {
        res.render('createGroup');
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
        var name = req.user.username;
        console.log("LOGGIN OUT " + req.user.username)
        req.logout();
        res.redirect('/');
        req.session.notice = "You have successfully been logged out " + name + "!";
    });


    // Initialize a new socket.io application, named 'chat'
    var chat = io.on('connection', function(socket) {

        // When the client emits the 'load' event, reply with the
        // number of people in this chat room

        socket.on('load', function(data) {

            var room = findClientsSocket(io, data);
            if (room.length === 0) {

                socket.emit('peopleinchat', { number: 0 });
            } else if (room.length === 1) {

                socket.emit('peopleinchat', {
                    number: 1,
                    user: room[0].username,
                    avatar: room[0].avatar,
                    id: data
                });
            } else if (room.length >= 2) {

                chat.emit('tooMany', { boolean: true });
            }
        });

        // When the client emits 'login', save his name and avatar,
        // and add them to the room
        socket.on('login', function(data) {

            var room = findClientsSocket(io, data.id);
            // Only two people per room are allowed
            if (room.length < 2) {

                // Use the socket object to store data. Each client gets
                // their own unique socket object

                socket.username = data.user;
                socket.room = data.id;
                socket.avatar = gravatar.url(data.avatar, { s: '140', r: 'x', d: 'mm' });

                // Tell the person what he should use for an avatar
                socket.emit('img', socket.avatar);


                // Add the client to the room
                socket.join(data.id);

                if (room.length == 1) {

                    var usernames = [],
                        avatars = [];

                    usernames.push(room[0].username);
                    usernames.push(socket.username);

                    avatars.push(room[0].avatar);
                    avatars.push(socket.avatar);

                    // Send the startChat event to all the people in the
                    // room, along with a list of people that are in it.

                    chat.in(data.id).emit('startChat', {
                        boolean: true,
                        id: data.id,
                        users: usernames,
                        avatars: avatars
                    });
                }
            } else {
                socket.emit('tooMany', { boolean: true });
            }
        });

        // Somebody left the chat
        socket.on('disconnect', function() {

            // Notify the other person in the chat room
            // that his partner has left

            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room: this.room,
                user: this.username,
                avatar: this.avatar
            });

            // leave the room
            socket.leave(socket.room);
        });


        // Handle the sending of messages
        socket.on('msg', function(data) {

            // When the server receives a message, it sends it to the other person in the room.
            socket.broadcast.to(socket.room).emit('receive', { msg: data.msg, user: data.user, img: data.img });
        });
    });
};

function findClientsSocket(io, roomId, namespace) {
    var res = [],
        ns = io.of(namespace || "/"); // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if (roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId);
                if (index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}

var insertDocument = function(doc, collectionName, callback) {
    // Get the documents collection
    console.log(GLOBAL.mongoDB)
    var collection = GLOBAL.mongoDB.collection(collectionName);
    // Insert some documents
    collection.insertOne(doc, function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted  documents into the " + collectionName + " collection");
        callback(result);
    });
};

var findDocuments = function(doc, collectionName, callback) {
    // Get the documents collection
    var collection = GLOBAL.mongoDB.collection(collectionName);
    // Find some documents
    collection.find(doc).toArray(function(err, docs) {
        assert.equal(err, null);
        assert.equal(2, docs.length);
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
    });
};
