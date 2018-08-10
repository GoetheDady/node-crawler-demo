let express = require('express');
let cheerio = require('cheerio');
let superagent = require('superagent');
let charset = require('superagent-charset');
let app = express();
charset(superagent);

app.get('/', function (req, res, next) {
    superagent.get('http://op.hanhande.com/shtml/op_wz/list_2594_1.shtml')
        .charset('gb2312')
        .end(function (err, sres) {
            if (err) {
                return next(err)
            }
            let $ = cheerio.load(sres.text);
            let arr = [];
            let num = 0;
            $('.content .listbox .list li').each(function (index, element) {
                num++;
                let $time = $(element).find('span');
                let $title = $(element).find('a');
                let $url = $(element).find('a');
                arr.push({
                    title: $title.attr('title'),
                    time: $time.text().slice(1, 6),
                    url: $url.attr('href')
                })
            })
            console.log(num);

            res.send(arr)
        })
})

app.listen(8888, function () {
    console.log('抓取成功')
})