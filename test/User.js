var User = require('../model/User.js');

module.exports = function(api, data) {
	return {
		creationFail1: function(test) {
			api.request('UserAdd', 'POST', {}, function(err, response) {
				test.ifError(err);
				test.equal(response.error, 'Sie müssen einen Benutzernamen angeben.');
				test.done();
			});
		},
		creationFail2: function(test) {
			api.request('UserAdd', 'POST', {name: 'SargTeX'}, function(err, response) {
				test.ifError(err);
				test.equal(response.error, 'Sie müssen ein Passwort wählen.');
				test.done();
			});
		},
		creationFail3: function(test) {
			api.request('UserAdd', 'POST', {name: 'SargTeX', password: 'abc'}, function(err, response) {
				test.ifError(err);
				test.equal(response.error, 'Sie müssen eine E-Mail Adresse wählen.');
				test.done();
			});
		},
		creation1: function(test) {
			api.request('UserAdd', 'POST', {name: 'SargTeX', password: 'abc', email: 'martin.bories@megatherium.solutions'}, function(err, response) {
				console.log('lil');
				test.ifError(err);
				console.log('lel');
				test.equal(response.status, 'success');
				console.log('lal');
				test.ok(response.data.userId);
				console.log('removing');
				test.expect(2);
				test.done();
				User.find({_id: response.data.userId})
					.remove(function(err) {
						console.log('removed');
						test.ifError(err);
						console.log('removed');
						test.done();
						console.log('removed');
					});
			});
		},
		creationFail4: function(test) {
			api.request('UserAdd', 'POST', {name: 'SargTeX', password: 'abc', email: 'martin.bories@megatherium.solutions'}, function(err, response) {
				test.ifError(err);
				test.equal(response.status, 'success');
				test.ok(response.data.userId);
				api.request('UserAdd', 'POST', {name: 'SargTeX', password: 'abc', email: 'martin.bories@megatherium.solutions'}, function(err2, response2) {
					test.ifError(err2);
					test.equal(response2.error, 'Der Benutzername ist bereits vergeben.');
					User.find({_id: response.data.userId})
						.remove(function(err) {
							test.ifError(err);
							test.done();
						});
				});
			});
		},
		creation2: function(test) {
			api.request('UserAdd', 'POST', {name: 'Teflo', password: 'abc', email: 'florian.valerius@megatherium.solutions'}, function(err, response) {
				test.ifError(err);
				test.equal(response.status, 'success');
				test.ok(response.data.userId);
				User.remove({_id: response.data.userId})
					.exec(function(err) {
						test.ifError(err);
						test.done();
					});
			});
		},
		creationFail5: function(test) {
			api.request('UserAdd', 'POST', {name: 'Teflo', password: 'abc', email: 'florian.valerius@megatherium.solutions'}, function(err, response) {
				test.ifError(err);
				test.equal(response.status, 'success');
				test.ok(response.data.userId);
				api.request('UserAdd', 'POST', {name: 'Teflo', password: 'abc', email: 'florian.valerius@megatherium.solutions'}, function(err2, response2) {
					test.ifError(err2);
					test.equal(response2.error, 'Der Benutzername ist bereits vergeben.');
					User.remove({_id: response.data.userId})
						.exec(function(err) {
							test.ifError(err);
							test.done();
						});
				});
			});
		}
	};
};