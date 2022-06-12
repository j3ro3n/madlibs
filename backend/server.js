var express = require('express');
var app = express();

var postLogin = [{nickname: "klaas", sessieid: '80008'},{nickname: "piet", sessieid: ""}]

app.get('/', (req, res) => {
    res.json(postLogin);
})

app.listen(1234)
