var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Session = new mongoose.Schema({
	user: {type: ObjectId, ref: 'User', required: true},
	createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Session', Session);