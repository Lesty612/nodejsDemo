/**
 * [爬虫读取gb2312编码页面]
 * @author Lesty
 * @codeDate 2016.4.30
 */
var superagent = require('superagent'),
    charset = require('superagent-charset'),
    cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    path = require('path');

var baseUrl = 'http://gdgs.chinaxinge.com/gdgs/sty9/style_newsshow.asp?id=32955&newsid=',
    baseNewsId = 1695914,
    // 要获取的url的数量
    URL_COUNT = 5,
    // 最终要爬的网址数组
    finalUrls = [],
    // 文件名
    fileName = "",
    // 文件内容
    fileContent = "",
    // 保存的文件夹目录
    FILEDIR = "saigeInfo",
    // cheerio实现的jquery接口对象
    $ = null;


// 确定最终url数组
finalUrls = makeFinalUrls(URL_COUNT);

// 创建相应目录
fs.access(FILEDIR, fs.R_OK | fs.W_OK, (err) => {
    if(err) {
        fs.mkdirSync(FILEDIR);
        console.log(FILEDIR + "目录不存在！创建中··");
    } else {
        console.log(FILEDIR + "，目录访问中···");
    }

    console.log("赛鸽相关信息爬虫启动中···");
    
    // 绑定上superagent
    charset(superagent);
    // async控制并发数量为2
    async.eachLimit(finalUrls, 2, function(url, callback) {
        // 文件编码为gbk
        superagent.get(url).charset('gbk').end(function(err, res) {
            // 获取jquery对象接口
            // res.text保存着当前网页的html内容
            $ = cheerio.load(res.text);
            console.log("fetch: " + url);

            // 获取最终文件名和文件内容
            fileName = path.join(FILEDIR, $(".p4").text().split("\r\n").join("").trim() + ".txt");
            fileContent = $("#BodyLabel").text().trim();        

            // 读到格式不对的页面，则跳过(文件名为空的就是)
            if(fileName == path.join(FILEDIR, ".txt")) {
                callback();
            } else {
                // 写入并保存文件
                fs.writeFile(fileName, fileContent, function(err, file) {
                    console.log(fileName + "文件保存完毕！");
                    callback(null);
                });
            }
        });
    }, function(err) {
        console.log("所有网址信息保存完毕！");
    });
});


/**
 * [makeFinalUrl 根据数量确定最终要爬的网址]
 * @param  {Number} count [url数量]
 * @return {Arrat}     [最终的url数组]
 */
function makeFinalUrls(count) {
    var arr = [];
    while(count--) {
        arr.push(baseUrl + (baseNewsId + count));
    }

    return arr;
}