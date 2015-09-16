var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Thread = new mongoose.Schema({
	label: {type: String, required: true},
	author: {type: ObjectId, ref: 'User', required: true},
	board: {type: ObjectId, ref: 'Board', required: true},
	createdAt: {type: Date, default: Date.now, required: true},
	flags: [{type: String, enum: []}]/*,
	highlightedPosts: [{
		label: {type: String, required: true},
	}]*/
});

module.exports = mongoose.model('Thread', Thread);