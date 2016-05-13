var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var marked = require('marked-engine');
var DocDB = require('./framework/docDB');


var session = require('express-session');
var DocumentDBSessionStore = require('express-session-documentdb');
var sessionMiddleware = {};
var passport = require('passport');

var app = express();

var clients = {};
	

//globals
docDB = null;

// simple html view engine
app.engine('html', function (filePath, options, callback) { 
  fs.readFile(filePath, function (err, content) {
    if (err) throw new Error(err);
    return callback(null, content.toString());
  })
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('azure ermahgerd'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//read in the global configuration settings in settings.json
siteConfig = {};
if(fs.existsSync('./settings.json')) {
    siteConfig = JSON.parse(fs.readFileSync('./settings.json').toString());
}

if(siteConfig.initialized) {
    docDB = new DocDB(siteConfig.documentdb);
	sessionMiddleware = session({ 
	secret: 'azure ermahgerd', 
	saveUninitialized: true, 
	resave: true, 
	store: new DocumentDBSessionStore(siteConfig.documentdb),
	cookie: {_expires :6 * 60  * 60 * 1000 },
	});
    app.use(sessionMiddleware);	
    require('./framework/config')(passport);
    app.use(passport.initialize());
    app.use(passport.session());         
} else {
    app.get("/",function(req, res, next) {
        res.render('init.html');
    });
}

app.use('/', require('./routes/default'));
app.use('/', require('./routes/partial'));
app.use('/config', require('./routes/config'));
app.use('/user', require('./routes/user'));
app.use('/admin', require('./routes/admin'));
app.use('/auth', require('./routes/auth')(passport));

app.get("/documentation",function(req, res, next) {
    marked.renderFile('./readme.md', function(e, html) {
        res.send(e || html);
    });
});

app.use(function(req, res, next){
  res.status(404).send('Sorry, unable to locate this resource');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Error');
});


var http = require('http').createServer(app);

var io = require('socket.io')(http)
	.use(function(socket, next){
		sessionMiddleware(socket.request, {}, next);
		console.log('middleware function run');
	})
	.on('connection', function(socket) {
		var userId = socket.request.session.passport.user;
		console.log(userId + " has connected");
		clients[socket.id] = userId;
		socket.on('disconnect', function() {
			console.log(clients[socket.id] + " has disconnected");
			delete clients[socket.id];
		});
	});

http.listen(443);
