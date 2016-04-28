var cheerio = require('cheerio'),
	superagent = require('superagent'),
	url = require('url'),
	async = require('async');

var baseUrl = "https://cnodejs.org/";

console.log("try to fetch:" + baseUrl + "...");
superagent.get(baseUrl).end(function(err, sRes) {
    if (err) {
        return console.log(err);
    }

    	// 所有主题的链接以及标题
    var topics = [],
    	// 爬虫最终的JSON样式
    	resultJson = {},
    	// 当前并发数
    	curConnectCount = 0,
    	// 总连接数
    	allCount = 0,
    	// 已完成连接数
    	connectedCount = 0,
        $ = cheerio.load(sRes.text);

    // 获取首页主题所有链接和标题
    $("#topic_list > .cell .topic_title").each(function(i, ele) {
    	var $ele = $(ele);

    	topics.push({
    		tUrl: url.resolve(baseUrl, $ele.attr("href")),
    		tTitle: $ele.text().trim()
    	});
    });

    allCount = topics.length;

    // 控制并发数量为3
    async.mapLimit(topics, 3, function(topic, callback) {
	    	curConnectCount++;
	    	connectedCount++;
	        console.log("fetch: " + topic.tUrl + " successful!");
	        console.log("当前进度：" + connectedCount + "/" + allCount + "  当前并发数：" + curConnectCount);
    	    superagent.get(topic.tUrl).end(function(err, res) {
    	    	curConnectCount--;
				$ = cheerio.load(res.text);
				resultJson = {
					title: topic.tTitle,
					href: topic.tUrl,
					author: $(".changes > span > a").text(),
					firstReplay: $(".reply_content").eq(0).text().trim(),
					Replayer: $(".reply_author").eq(0).text().trim()
				};

				callback(null, resultJson);
    	});
    }, function(err, result) {
		console.log("result:");
		console.log(result);
    });
});