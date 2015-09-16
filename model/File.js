var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var File = new mongoose.Schema({
	label: {type: String, default: null},
	description: {type: String, default: null},
	author: {type: ObjectId, ref: 'User', required: true},
	// der ursprüngliche Dateiname vor dem Upload
	filename: {type: String, default: null},
	// die Größe der Datei, in Bytes
	size: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('File', File);