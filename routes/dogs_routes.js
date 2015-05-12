'use strict';

var bodyparser = require('body-parser');
var Dog = require('../models/Dog');

function returnError(err, res) {
	console.log(err);
	return res.status(500).json({msg: 'internal server error'});
}

module.exports = function(router) {

	router.use(bodyparser.json());

	router.get('/dogs', function(req, res) {
		Dog.findAll(function(err, data) {
			if (err) { return returnError(err, res); }
			res.json(data);
		});
	});

	router.post('/dogs', function(req, res) {
		Dog.save(req.body, function(err, data) {
			if (err) { return returnError(err, res); }
			res.json({msg: 'dog saved (post)', dogData: JSON.parse(data)});
		});
	});

	router.put('/dogs/:id', function(req, res) {
		var updatedDog = req.body;
		Dog.update(req.params.id, updatedDog, function(err, data) {
			if (err) { return returnError(err, res); }
			res.json({msg: 'dog updated (put)', dogData: JSON.parse(data)});
		});		
	});

	router.patch('/dogs/:id', function(req, res) {
		Dog.findById(req.params.id, function(err, data) {
			if (err) { return returnError(err, res); }

			var dog = JSON.parse(data);
			var userDog = req.body;

			//Code edited from stack overflow
			//http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
			for (var attr in userDog) {
				dog[attr] = userDog[attr]; 
			}

			Dog.update(req.params.id, dog, function(err, data) {
				if (err) { return returnError(err, res); }
				res.json({msg: 'dog updated (patch)', dogData: JSON.parse(data)});
			});
		});
	});

	router.delete('/dogs/:id', function(req, res) {
		Dog.delete(req.params.id, function(err, file) {
			if (err) { return returnError(err, res); }
			res.json({msg: 'dog has been deleted'});
		});
	});

};