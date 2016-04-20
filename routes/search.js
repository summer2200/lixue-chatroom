var UserItem = require('../models/userItem');

module.exports = function(app) {
    app.get('/search', function(req, res) {

        // Render views/home.ejs
        res.render('search', {layout: 'layout'});
    });

    app.post('/search', function(req, res) {
        var userName = req.userName;

        UserItem.find({name: userName},function(users) {

            res.json('search', {users: users});
        })
        // Render views/home.ejs

    });
}