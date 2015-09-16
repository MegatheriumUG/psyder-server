var mongoose = require('mongoose');

var Usergroup = new mongoose.Schema({
	label: {type: String, required: true}
});

module.exports = mongoose.model('Usergroup', Usergroup);