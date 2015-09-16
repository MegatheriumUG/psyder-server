var async = require('async'),
	config = require('./config.js'),
	qs = require('querystring'),
	request = require('request'),
	User = require('./model/User.js');

var api = {
	request: function(controller, method, form, callback) {
		if (method == 'POST') return request.post('http://localhost:'+config.port+'/'+controller, {form: form, json: true}, function(err, http, body) {
			callback(err, body);
		});

		request.get('http://localhost:'+config.port+'/'+controller+(Object.keys(form).length > 0 ? '?'+qs.querystring(form) : ''), {json: true}, function(err, http, body) {
			callback(err, body);
		});
	}
}

var data = {
	users: []
};

module.exports = {
	controller: {
		User: require('./test/User.js')(api, data)
	}/*,
	tearDown: function(callback) {
		async.eachSeries(data.users, function(userId, next) {
			User.remove({_id: userId})
				.exec(next);
		}, callback);
	}*/
};