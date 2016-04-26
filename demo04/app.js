/**
 * [多并发事件爬虫]
 * @author Lesty
 * @codeDate 2016.4.25
 */
var superagent = require('superagent'),
    cheerio = require('cheerio'),
    // 多并发事件处理，避免嵌套异步事件
    eventproxy = require('eventproxy'),
    url = require('url');

var baseUrl = "https://cnodejs.org/";


console.log("try to fetch:" + baseUrl);
superagent.get(baseUrl).end(function(err, sRes) {
    if (err) {
        return console.log(err);
    }

    	// 所有主题的链接以及标题
    var topics = [],
        $ = cheerio.load(sRes.text);

    // 获取首页主题所有链接
    $("#topic_list > .cell .topic_title").each(function(i, ele) {
    	var $ele = $(ele);

    	topics.push({
    		tUrl: url.resolve(baseUrl, $ele.attr("href")),
    		tTitle: $ele.text().trim()
    	});
    });

    	// 创建一个ep实例
    var ep = new eventproxy(),
    	// 爬虫最终的JSON样式
    	resultJson = [];
    // 当fetch_url事件触发topics.length次数后，调用回调函数
    ep.after('fetch_url', topics.length, function(topicPairs) {
    	resultJson = topicPairs.map(function(pairs, i, arr) {
    		var tUrl = pairs.tUrl,
    			tTitle = pairs.tTitle,
    			$ = cheerio.load(pairs.text);

    		return {
    			title: tTitle,
    			href: tUrl,
    			author: $(".changes > span > a").text(),
    			firstReplay: $(".reply_content").eq(0).text().trim(),
    			Replayer: $(".reply_author").eq(0).text().trim()
    		}
    	});

    	console.log(resultJson);
    });

    // 遍历所有链接
    topics.forEach(function(topic, i, arr) {
    	superagent.get(topic.tUrl).end(function(err, res) {
            console.log("fetch: " + topic.tUrl + "successful!");
    		topic.text = res.text;
    		// 触发fetch_url事件
    		ep.emit('fetch_url', topic);
    	});
    });
});