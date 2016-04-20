module.exports = function(app) {
    app.get('/create-group', function(req, res) {

        // Render views/home.ejs
        res.render('createGroup', {layout: 'layout'});
    });

    // app.post('/create-group', function(req, res) {
    //     var userName = req.userName;

    //     UserItem.find({name: userName},function(users) {

    //         res.json('search', {users: users});
    //     })
    //     // Render views/home.ejs

    // });
}