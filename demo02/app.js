var express = require('express');
var utility = require('utility');

var app = express();

app.get('/', function(req, res) {
	var q = req.query.q,
		md5Value = utility.md5(q);

	res.send(md5Value);
});

app.listen(8777, function(req, res) {
	console.log("App is listening at port 8777");
});