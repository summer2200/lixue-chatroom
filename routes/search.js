var UserItem = require('../models/userItem');

module.exports = function(app) {
    app.get('/search', function(req, res) {

        // Render views/home.ejs
        res.render('search', {layout: 'layout'});
    });

    app.post('/search', function(req, res) {

        var userName = new RegExp(req.body.userName, 'i');

        UserItem.find({name: userName},function(err, users) {

            res.status(200).json( users);
        })
        // Render views/home.ejs

    });
}