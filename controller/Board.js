var config = require('../config.js'),
	Board = require('../model/Board.js');

exports.setup = function(app) {
	/**
	 * Erstellt ein neues Forum.
	 * Benötigt Administratorrechte.
	 *
	 * @param label	String	der Name des Forums
	 * @param description	String	optional; eine Beschreibung des Forums
	 *								Standardwert: ''
	 * @param usergroups	String[]	die IDs der Benutzergruppen, die auf dieses Forum Zugriff erhalten sollen
	 * @param parentId	String	optional; die ID des Forums, welche als übergeordnetes Forum fungiert
	 *							Standardwert: null
	 * @return boardId	String	die ID des erstellten Forums
	 */
	app.post('/BoardAdd', function(req, res, jump) {
		// Zugriff validieren
		if (!res.locals.user) return res.send({error: 'Zugriff verweigert.'});
		if (config.administrators.indexOf(res.locals.user._id.toString()) < 0) return res.send({error: 'Zugriff verweigert.'});

		// Parameter abfragen
		var label = req.body.label;
		var description = req.body.description ? req.body.description : '';
		var usergroups = req.body.usergroups;
		var parentId = req.body.parentId ? req.body.parentId : null;

		// Parameter validieren
		if (!label) return res.send({error: 'Sie müssen einen Namen für das Forum angeben.'});
		if (!usergroups) return res.send({error: 'Sie müssen angeben, für welche Benutzergruppen das Forum sichtbar sein soll.'});

		// Forum erstellen
		var board = new Board({
			label: label,
			description: description,
			usergroups: usergroups,
			parent: parentId
		});
		board.save(function(err) {
			if (err) return jump(err);

			// Antworten
			res.send({status: 'success', data: {boardId: board._id}});
		});
	});

	/**
	 * Listet alle Foren auf.
	 * Benötigt Login.
	 *
	 * @param boardId	String	optional; die Foren-ID, deren Unterforen aufgelistet werden sollen
	 * @return boards	model.Board[]
	 */
	app.get('/BoardList', function(req, res, jump) {
		// Zugriff validieren
		if (!res.locals.user) return res.send({error: 'Zugriff verweigert.'});

		// Parameter auslesen
		var boardId = req.query.boardId ? req.query.boardId : null;

		// Suche Forum
		Board.find({parent: boardId}})
			.elemMatch('usergroups', {$in: res.locals.user.usergroups})
			.exec(function(err, boards) {
				if (err) return jump(err);

				// Antworten
				res.send({data: {boards: boards}});
			});
	});
}