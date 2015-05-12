'use strict';

var fs = require('fs');
//Event emmiter code adatped from 
//http://code.tutsplus.com/tutorials/using-nodes-event-module--net-35941
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var dataFolder = process.env.DATAFOLDER || './data';

var Dog = {};

module.exports = exports = Dog;

Dog.save = function(data, callback) {
	getNextAvailableFileId(dataFolder);

	ee.on('next-id-found', function(id) {
		var file = dataFolder + '/' + id + '.json';
		data._id = id;
		writeFileData(file, JSON.stringify(data));
	});

	ee.on('file-written', function(dogData) {
		callback('', dogData);
		ee.removeAllListeners();
	});
};

Dog.update = function(id, data, callback) {
	var file = dataFolder + '/' + id + '.json';
	data._id = id;
	writeFileData(file, JSON.stringify(data));

	ee.on('file-written', function(dogData) {
		callback('', dogData);
		ee.removeAllListeners();
	});
};

Dog.findAll = function(callback) {
	var count = 0;
	var numOfFiles = 0;
	var dataArray = [];

	getFileIds(dataFolder);

	ee.on('files-found', function(files) {
		numOfFiles = files.length;
		if (numOfFiles === 0) { 
			callback('', dataArray);
			ee.removeAllListeners();
		}
		files.forEach(function(file) {
			getFileData(dataFolder + '/' + file);
		});
	});

	ee.on('file-data-found', function(data) {
		dataArray.push(data.toString('utf-8'));
		count++;

		if (count === numOfFiles) {
			callback('', dataArray);
			ee.removeAllListeners();
		}
	});
};

Dog.findById = function(id, callback) {
	getFileData(dataFolder + '/' + id + '.json');

	ee.on('file-data-found', function(data) {
		callback('', data.toString('utf-8'));
		ee.removeAllListeners('file-data-found');
	});
};

Dog.delete = function(id, callback) {
	var file = dataFolder + '/' + id + '.json';
	deleteFile(file);

	ee.on('file-deleted', function(file) {
		callback('', file);
		ee.removeAllListeners();
	});
};

Dog.deleteAll = function(callback) {
	var count = 0;
	var numOfFiles = 0;

	getFileIds(dataFolder);

	ee.on('files-found', function(files) {
		numOfFiles = files.length;
		files.forEach(function(file) {
			deleteFile(dataFolder + '/' + file);
		});
	});

	ee.on('file-deleted', function(file) {
		count++;
		if (count === numOfFiles) {
			callback('', 'all files deleted');
			ee.removeAllListeners();
		}
	});
};

function getNextAvailableFileId(dataFolder) {
	fs.readdir(dataFolder, function(err, files) {
		if (err) { throw err; }
		var nextAvailableId = files.reduce(function(initial, current) {
			if (parseInt(current) < parseInt(initial)) {
				return parseInt(initial);
			}
			return parseInt(current);
		}, 0);
		nextAvailableId++;

		ee.emit('next-id-found', nextAvailableId);
	});
}

function writeFileData(file, data) {
	fs.writeFile(file, data, function(err) {
		if (err) { throw err; }
		ee.emit('file-written', data);
	});
}

function deleteFile(file) {
	fs.unlink(file, function(err) {
		if (err) { throw err; }
		ee.emit('file-deleted', file);
	});
}

function getFileIds(dataFolder) {
	fs.readdir(dataFolder, function(err, files) {
		if (err) { throw err; }
		ee.emit('files-found', files);
	});
}

function getFileData(file) {
	fs.readFile(file, function(err, data) {
		if (err) { throw err; }
		ee.emit('file-data-found', data);
	});
}