var users = require('./users');
var proposal = require('./proposal');
var proposalPage = require('./proposalpage');
var images = require('./images');

module.exports = function (app, passport) {
    // Logout and getting username
    app.get('/logout', users.signout);
    app.get('/users/me', users.me);
    // Register user
    app.post('/register', users.create);
    // Get username from param
    app.param('userId', users.user);
    // Check if user is logged in
    app.get('/loggedin', function(req,res){
        res.send(req.isAuthenticated() ? req.user : '0');
    });
    // Login using local strategy
    app.post('/login', passport.authenticate('local'), function(req,res){
        res.send({
            user: req.user,
            redirect: req.get('referer')+"#/hub"
        });
    });
    app.post('/forgotPassword',users.forgotPassword);
    app.post('/updateUser',users.updateUser);
    app.delete('/accountDelete/:id',users.deleteAccount);
    // Facebook authentication
    app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email','user_about_me']}), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/success', failureRedirect: '/login' }), users.authCallback);
    app.get('/auth/success', function(req, res) {
        res.render('after-auth', { state: 'success', user: req.user ? req.user : null });
    });
    app.get('/auth/failure', function(req, res) {
        res.render('after-auth', { state: 'failure', user: null });
    });

    app.get('/api/secured/*',
        function (req, res, next) {
            if (!req.user) {
                return res.json({ error: 'This is a secret message, login to see it.' });
            }
            next();
        },
        function (req, res) {
            res.json({ message: 'This message is only for authenticated users' });
        });

    app.get('/api/*', function (req, res) {
        res.json({ message: 'This message is known by all' });
    });
    
    app.get('/', function (req, res) {
        res.render('index', { user: req.user ? req.user : null });
    });

    app.post('/genPDF', proposal.genproposal());
    app.post('/saveProposal', proposal.addProposal);
    app.get('/proposalList', proposal.list);
    app.post('/proposalLoad', proposal.load);
    app.delete('/proposalDelete/:id/:name', proposal.delete);

    app.post('/uploadImage', images.uploadIcon);

    app.post('/proposalpage', proposalPage.add);
    app.get('/proposalpage', proposalPage.list);
    app.delete('/proposalpage/:name', proposalPage.delete);
};