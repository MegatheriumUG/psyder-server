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

module.exports = mongoose.model('Board', Board);