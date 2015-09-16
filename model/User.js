var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Jeder Nutzer kann entweder ein Mensch oder ein Bot sein.
 * Bots erhalten nur über die API Zugriff, und können darüber z.B. Fehlermeldungen einsenden.
 */
var User = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	bot: {type: Boolean, required: true, default: false},
	usergroups: [{type: ObjectId, ref: 'Usergroup'}]
});

module.exports = mongoose.model('User', User);