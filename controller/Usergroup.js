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
}