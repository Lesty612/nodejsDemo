var express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.send("Hello Lesty!");
});

app.listen(8777, function() {
	console.log("App is listening at port 8777");
});