var express = require('express'),
    expressValidator = require('express-validator'),
    mongoStore = require('connect-mongo')(express),
    path = require('path');

module.exports = function (passport, db) {
    var app = express();
    app.set('port', process.env.PORT || 5050);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
    app.use(express.favicon(__dirname + '/../public/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.bodyParser({keepExtensions:true,uploadDir:__dirname+'/../public/icons/tmp'}));
    app.use(expressValidator());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'my-session-store',
        store: new mongoStore({
            url: db,
            collection : 'sessions'
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static(path.join(__dirname, '/../public')));

    app.use(app.router);

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
        app.use(function(req, res, next) {
             next();
        });
    }

    return app;
};