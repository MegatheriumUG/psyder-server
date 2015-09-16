var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Post = new mongoose.Schema({
	label: {type: String},
	author: {type: ObjectId, ref: 'User', required: true},
	thread: {type: ObjectId, ref: 'Thread', required: true},
	createdAt: {type: Date, default: Date.now, required: true},
	parent: {type: ObjectId, ref: 'Post'},
	content: {type: String, required: true},
	attachments: [{type: ObjectId, ref: 'File'}],
	// wenn nicht leer, dann ist dieser Post nur für die Nutzergruppen in diesem Array sichtbar
	usergroups: [{type: ObjectId, ref: 'Usergroup'}]
});

module.exports = mongoose.model('Post', Post);