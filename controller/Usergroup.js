var config = require('../config.js'),
	Usergroup = require('../model/Usergroup.js');

exports.setup = function(app) {
	/**
	 * Erstellt eine neue Benutzergruppe.
	 * Benötigt Administratorrechte.
	 *
	 * @param label	String	der Name der Benutzergruppe
	 * @return usergroupId	String	die ID der Benutzergruppe
	 */
	app.post('/UsergroupAdd', function(req, res, jump) {
		// Zugriff validieren
		if (!res.locals.user) return res.send({error: 'Zugriff verweigert.'});
		if (config.administrators.indexOf(res.locals.user._id.toString()) < 0) return res.send({error: 'Zugriff verweigert.'});

		// Parameter abfragen
		var label = req.body.label;

		// Parameter validieren
		if (!label) return res.send({error: 'Sie müssen einen Namen angeben.'});

		// Benutzergruppe erstellen
		var usergroup = new Usergroup({label: label});
		usergroup.save(function(err) {
			if (err) return jump(err);

			// Antworten
			res.send({status: 'success', data: {usergroupId: usergroup._id}});
		});
	});

	/**
	 * Bearbeitet eine Benutzergruppe.
	 * Benötigt Administratorrechte.
	 *
	 * @param usergroupId	String	die ID der Benutzergruppe
	 * @param label	String	der neue Name der Gruppe
	 */
	app.post('/UsergroupUpdate', function(req, res, jump) {
		// Zugriff validieren
		if (!res.locals.user) return res.send({error: 'Zugriff verweigert.'});
		if (config.administrators.indexOf(res.locals.user._id.toString()) < 0) return res.send({error: 'Zugriff verweigert.'});

		// Parameter abfragen
		var usergroupId = req.body.usergroupId;
		var label = req.body.label;

		// Parameter validieren
		if (!usergroupId) return res.send({error: 'Sie müssen die Benutzergruppe angeben.'});
		if (!label) return res.send({error: 'Sie müssen einen Namen angeben.'});

		// Benutzergruppe finden
		Usergroup.findOne({_id: usergroupId})
			.exec(function(err, usergroup) {
				if (err) return jump(err);

				// Benutzergruppe validieren
				if (!usergroup) return res.send({error: 'Die Benutzergruppe konnte nicht gefunden werden.'});

				// Benutzergruppe aktualisieren
				usergroup.label = label;
				usergroup.save(function(err) {
					if (err) return jump(err);

					// Antworten
					res.send({status: 'success'});
				});
			});
	});
};