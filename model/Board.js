var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Board = new mongoose.Schema({
	label: {type: String, required: true},
	description: {type: String},
	// die Nutzergruppen, die auf dieses Forum Zugriff haben werden
	usergroups: [{type: ObjectId, ref: 'Usergroup'}],
	// wenn dies ein Board der Ebene 2 oder 3 oder ... ist...
	parent: {type: ObjectId, ref: 'Board'}
});

/**
 * Überprüft, ob der Nutzer Zugriff auf dieses Forum hat.
 *
 * @param user	model.User	der Nutzer
 * @return boolean
 */
Board.hasAccess = function(user) {
	var usergroups = this.usergroups;
	for (var i = 0; i < usergroups.length; ++i)
		for (var j = 0; j < user.usergroups.length; ++j)
			if (usergroups[i].equals(user.usergroups[j])) return true;

	return false;
};

module.exports = mongoose.model('Board', Board);