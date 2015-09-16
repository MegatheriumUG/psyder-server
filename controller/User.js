var async = require('async'),
	parse = require('mongoose-parse'),
	Session = require('../model/Session.js'),
	User = require('../model/User.js');

exports.setup = function(app) {
	/**
	 * Erstellt einen neuen Benutzeraccount.
	 *
	 * @param name	String	der Name des Benutzers
	 * @param password	String	das Passwort des Benutzers
	 * @param email	String	die E-Mail Adresse des Benutzers
	 * @param bot	Integer	optional; wenn 1, dann handelt es sich um den erstellten Nutzer um einen Bot-Account
	 *						Standardwert: 0
	 * @return userId	String	die ID des erstellten Benutzers
	 */
	app.post('/UserAdd', function(req, res, jump) {
		// Parameter abfragen
		var name = req.body.name;
		var password = req.body.password;
		var email = req.body.email;
		var bot = req.body.bot && req.body.bot == 1 ? true : false;

		// Parameter validieren
		if (!name) return res.send({error: 'Sie müssen einen Benutzernamen angeben.'});
		if (!password) return res.send({error: 'Sie müssen ein Passwort wählen.'});
		if (!email) return res.send({error: 'Sie müssen eine E-Mail Adresse wählen.'});

		// Nutzer erstellen
		var user = new User({
			name: name,
			password: password,
			email: email,
			bot: bot
		});
		user.save(function(err) {
			if (err) {
				err = parse(err);
				if (err.code == 11000 && err.path == 'name') return res.send({error: 'Der Benutzername ist bereits vergeben.'});
				return jump(err);
			}

			// Antworten
			res.send({status: 'success', data: {userId: user._id}});
		});
	});

	/**
	 * Ermöglicht es einem Nutzer, sich anzumelden.
	 *
	 * @param name	String	der Name des Benutzers
	 * @param password	String	das Passwort des Benutzers
	 * @param bot	Integer	optional; wenn 1, wird versucht, sich in den Bot-Account anzumelden
	 * 						Standardwert: 0
	 * @return sessionId	String	die ID der erstellten Session
	 */
	app.post('/UserLogin', function(req, res, jump) {
		// Zugriff validieren
		if (res.locals.user) return res.send({error: 'Sie sind bereits angemeldet.'});

		// Parameter abfragen
		var name = req.body.name;
		var password = req.body.password;
		var bot = req.body.bot && req.body.bot == 1 ? true : false;

		// Parameter validieren
		if (!name) return res.send({error: 'Sie müssen einen Benutzernamen angeben.'});
		if (!password) return res.send({error: 'Sie müssen ein Passwort angeben.'});

		// nach Nutzer suchen
		User.findOne({name: name, password: password, bot: bot})
			.exec(function(err, user) {
				if (err) return jump(err);

				// Nutzer validieren
				if (!user) return res.send({error: 'Der Nutzer konnte nicht gefunden werden.'});

				// alte Sessions löschen
				Session.remove({user: user._id})
					.exec(function(err) {
						if (err) return jump(err);

						// neue Session erstellen
						var session = new Session({user: user._id});
						session.save(function(err) {
							if (err) return jump(err);

							// Antworten
							res.send({status: 'success', data: {sessionId: session._id}});
						});
					});

			});
	});
};