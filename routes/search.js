

module.exports = function(app) {
    app.get('/search', function(req, res) {

        // Render views/home.ejs
        res.render('search', {layout: 'layout'});
    });

    app.post('/search', function(req, res) {

        // Render views/home.ejs
        res.render('search');
    });
}