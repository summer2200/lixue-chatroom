var _ = require('lodash');
var async = require('async');
var UserItem = require('../models/userItem');
var mongoose = require('mongoose');

module.exports = function(app) {
    app.get('/search', function(req, res) {

        // Render views/home.ejs
        res.render('search', { layout: 'layout' });
    });

    app.post('/search', function(req, res) {

        var userName = new RegExp(req.body.userName, 'i');
        var userId = req.cookies.userId;
         var currentName = req.cookies.username;
         //async
        async.parallel({
            users: function(next) {
                UserItem.find({ name: userName }, function(err, users) {                   
                    users = users.filter(function(u) {
                        return currentName !== u.name;
                    });
                    next(null, users);                
                });
            },
            myFriends: function(next) {              
                UserItem.findOne({ _id: userId }, function(err, user) {
                    console.log(user.friends);
                    next(null, user.friends);
                });
            }
        }, function(err, result) {
            var users = result.users,
                myFriends = result.myFriends;
            users = users.filter(function(u) {
                var index = _.findIndex(myFriends, function(o) {
                    return o.id === u._id.toString();
                });
                return  index=== -1;
            });
            res.status(200).json(users);
        });
        // Render views/home.ejs

    });
}
