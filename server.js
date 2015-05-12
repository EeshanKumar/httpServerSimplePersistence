'use strict';

var express = require('express');
var app = express();
var router = express.Router();

require('./routes/dogs_routes')(router);

app.use('/api', router);

app.use(function(req, res) {
	res.status(404).send('404 - page not found');
});

app.listen(3000, function() {
	console.log('server has started');
});