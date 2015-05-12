'use strict';

process.env.DATAFOLDER = './test/data';
require('../server.js');

var mocha = require('mocha');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var Dog = require('../models/Dog');

describe('dogs REST API', function() {
	// Clear all files when done with all testing
	after(function(done) {
		Dog.deleteAll(function() {
			done();
		});
	});

	describe('tests that don\'t require existing dogs in the database', function() {
		it('should respond with an array to GET requests', function(done) {
			chai.request('localhost:3000')
				.get('/api/dogs')
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(Array.isArray(res.body)).to.eql(true);
					done();
				});
		});

		it('should save a dog on a POST request', function(done) {
			chai.request('localhost:3000')
				.post('/api/dogs')
				.send({name: 'Buster', type: 'crash test dummy dog'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog saved (post)');
					expect(res.body.dogData.name).to.eql('Buster');
					expect(res.body.dogData.type).to.eql('crash test dummy dog');
					done();
				});
		});
	});

	describe('tests that require existing dogs in the database', function() {
		var testDog = {name: 'Buster', breed: 'dummy'};
		var testDogData;

		beforeEach(function(done) {
			Dog.save(testDog, function(err, data) {
				if (err) {throw err;}
				testDogData = JSON.parse(data);
				done();
			});
		});

		it('should update a dog on a PUT request', function(done) {
			chai.request('localhost:3000')
				.put('/api/dogs/' + testDogData._id)
				.send({name: 'Buster Put A New'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog updated (put)');
					expect(res.body.dogData.name).to.eql('Buster Put A New');
					done();
				});
		});

		it('should update a dog on a PATCH request', function(done) {
			chai.request('localhost:3000')
				.patch('/api/dogs/' + testDogData._id)
				.send({name: 'Buster Patched'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog updated (patch)');
					expect(res.body.dogData.name).to.eql('Buster Patched');
					expect(res.body.dogData.breed).to.eql('dummy');
					done();
				});
		});

		it('should delete a dog on a DEL request', function(done) {
			chai.request('localhost:3000')
				.del('/api/dogs/' + testDogData._id)
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog has been deleted');
					done();
				});
		});
	});
});