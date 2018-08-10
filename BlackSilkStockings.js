let express = require('express');
let cheerio = require('cheerio');
let superagent = require('superagent');
let request = require('request');
let fs = require('fs');
let url = require('url');

let app = express();
const baiduUrl = 'https://tieba.baidu.com/';
app.get('/', (req, res, next) => {
    superagent.get('https://tieba.baidu.com/f?kw=%E9%BB%91%E4%B8%9D&ie=utf-8&tab=good&cid=3')
        .end((err, sres) => {
            if (err) {
                return next(err)
            }
            let tieUrl = [];
            let $ = cheerio.load(sres.text);
            $('#thread_list li').each((index, element) => {
                num ++;
                let $url = $(element).find('a.j_th_tit ');
                tieUrl.push(url.resolve(baiduUrl, $url.attr('href')) + '?see_lz=1')
            })
            for (let i = 0; i < tieUrl.length; i ++){
                console.log('开始抓取帖子图片');
                superagent.get(tieUrl[i])
                    .end((err, ssres) => {
                        if (err) {
                            return next(err)
                        }
                        let $ = cheerio.load(ssres.text);
                        $('.p_postlist .l_post').each((sindex, element) => {
                            let $element = $(element);
                            let imgUrl = $element.find('.BDE_Image');   
                            if (imgUrl.length > 0) {
                                download(imgUrl.attr('src'), imgUrl.attr('src').slice(-10));
                                console.log('帖子图片抓取完毕');                            
                            }
                        })
                    })
            }
        res.send(tieUrl)
        })
})
var download = function(url, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream("./data/" + filename));
    });
};
app.listen(8888, function () {
    console.log('等待请求开始爬取…………')
    console.log('Loading.......')
})


