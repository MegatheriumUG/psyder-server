var Thread = require('../model/Thread.js');

exports.setup = function(app) {
	/**
	 * Erstellt einen neuen Thread.
	 * Benötigt Login.
	 *
	 * @param label	String	der Name des Threads
	 * @param boardId	String	die ID des Forums
	 * @param content	String	der Inhalt des neuen Threads
	 * @return threadId	String	die ID des erstellten Threads
	 * @return postId	String	die ID des erstellten Posts
	 */
	app.post('/ThreadAdd', function(req, res, jump) {
		// Zugriff validieren
		if (!res.locals.user) return res.send({error: 'Zugriff verweigert.'});

		// Parameter abfragen
		var label = req.body.label;
		var content = req.body.content;
		var boardId = req.body.boardId;

		// Parameter validieren
		if (!label) return res.send({error: 'Sie müssen einen Titel für den Thread angeben.'});
		if (!content) return res.send({error: 'Sie müssen einen Inhalt für den ersten Beitrag angeben.'});
		if (!boardId) return res.send({error: 'Sie müssen ein Forum auswählen.'});

		// Forum suchen
		Board.findOne({_id: boardId})
			.exec(function(err, board) {
				if (err) return jump(err);

				// Forum validieren
				if (!board) return res.send({error: 'Forum konnte nicht gefunden werden.'});
				if (!board.hasAccess(user)) return res.send({error: 'Zugriff verweigert.'});

				// Thread erstellen
				var thread = new Thread({
					author: res.locals.user._id,
					board: boardId,
					label: label
				});
				var post = new Post({
					thread: thread,
					label: label
					content: content
				});
				async.parallel([
					function(next) {thread.save(next);},
					function(next) {post.save(next);}
				], function(err) {
					if (err) return jump(err);

					// Antworten
					res.send({status: 'success', data: {threadId: thread._id, postId: post._id}});
				});
			});
	});
}