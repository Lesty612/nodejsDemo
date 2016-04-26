/**
 * [�ಢ���¼�����]
 * @author Lesty
 * @codeDate 2016.4.25
 */
var superagent = require('superagent'),
    cheerio = require('cheerio'),
    // �ಢ���¼���������Ƕ���첽�¼�
    eventproxy = require('eventproxy'),
    url = require('url');

var baseUrl = "https://cnodejs.org/";


console.log("try to fetch:" + baseUrl);
superagent.get(baseUrl).end(function(err, sRes) {
    if (err) {
        return console.log(err);
    }

    	// ��������������Լ�����
    var topics = [],
        $ = cheerio.load(sRes.text);

    // ��ȡ��ҳ������������
    $("#topic_list > .cell .topic_title").each(function(i, ele) {
    	var $ele = $(ele);

    	topics.push({
    		tUrl: url.resolve(baseUrl, $ele.attr("href")),
    		tTitle: $ele.text().trim()
    	});
    });

    	// ����һ��epʵ��
    var ep = new eventproxy(),
    	// �������յ�JSON��ʽ
    	resultJson = [];
    // ��fetch_url�¼�����topics.length�����󣬵��ûص�����
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

    // ������������
    topics.forEach(function(topic, i, arr) {
    	superagent.get(topic.tUrl).end(function(err, res) {
            console.log("fetch: " + topic.tUrl + "successful!");
    		topic.text = res.text;
    		// ����fetch_url�¼�
    		ep.emit('fetch_url', topic);
    	});
    });
});