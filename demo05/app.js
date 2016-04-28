/**
 * [通过async限制并发数量]
 * @author Lesty
 * @codeDate 2016.4.28
 */
var async = require('async');

var curCount = 0,
	items = [];

function fetchUrl(item, callback) {
	curCount++;
	console.log("并发数量:" + curCount + " 正在抓取：" + item.url + "耗时：" + item.delay + "ms");
	setTimeout(function() {
		curCount--;
		callback(null, item.url + " delay: " + item.delay)
	}, item.delay);
}

function createItems(len) {
	var items = [];
	for(var i = len; i--;) {
		items.push({
			url: 'http://datasource_' + i,
			delay: parseInt(Math.random() * 2000, 10)
		});
	}

	return items;
}

items = createItems(30);
async.mapLimit(items, 5, function(item, callback){
	fetchUrl(item, callback)
}, function(err, result) {
	console.log("result: ");
	console.log(result)
});