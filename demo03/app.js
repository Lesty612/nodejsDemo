/**
 * [爬虫示例]
 * @author Lesty
 * @codeDate 2016.4.25
 */
var superagent = require("superagent"),
	cheerio = require("cheerio");

superagent.get("https://developer.mozilla.org/en-US/docs/Web/JavaScript").end(function(err, sres) {
	if(err) {
		return next(err);
	}

	// sres.text中保存着html文本
	// cheerio.load后就得到一个实现了jquery接口的变量
	var $ = cheerio.load(sres.text),
		items = [];

	$("#quick-links li a").each(function(index, item) {
		var $ele = $(item);
		items.push({
			href: $ele.attr("href"),
			title: $ele.children("strong").text()
		});
	});

	console.log(items);
});	



