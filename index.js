var bodyParser = require('body-parser'),
	config = require('./config.js'),
	error = require('./error.js'),
	express = require('express'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	Session = require('./model/Session.js');

// erstelle Express-App
var app = express();

// Server-Plugins
app.use(bodyParser.urlencoded({extended: true}));

// Session handling
app.all('*', function(req, res, callback) {
	// suche Session
	var sessionId = req.query.hasOwnProperty('sessionId') ? req.query.sessionId : req.body.sessionId;
	if (!sessionId) return callback();
	Session.findOne({_id: sessionId})
		.populate('user')
		.exec(function(err, session) {
			if (err) return callback(err);

			// überprüfe Session
			if (!session) return res.send({error: 'Deine Session ist abgelaufen.'});
			res.locals.session = session;
			res.locals.user = session.user;
			callback();
		});
});

// Controller importieren
fs.readdir(__dirname+'/controller', function(err, files) {
	if (err) return error(err);

	for (var i = 0; i < files.length; ++i) {
		require('./controller/'+files[i]).setup(app);
	}
});

// Models importieren
fs.readdir(__dirname+'/model', function(err, files) {
	if (err) return error(err);

	for (var i = 0; i < files.length; ++i)
		require('./model/'+files[i]);
});

// Datenbank verbinden
mongoose.connect('mongodb://'+config.database.host+(config.database.port ? ':'+config.database.port : '')+'/'+config.database.name, function(err) {
	if (err) return error(err);

	// Server starten
	app.listen(config.port, function(err) {
		if (err) return error(err);

		console.log('Webserver started on port :'+config.port);
	});
});