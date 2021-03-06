/**
 * Created by hr on 2016/8/18.
 */

var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var router = express.Router();

router.use(function(req, res, next){
    var ua = req.headers['user-agent'];
    db.zadd('online', Date.now(), ua, next);
});

router.use(function(req, res, next){
    var min = 60 * 1000;
    var ago = Date.now() - min;
    db.zrevrangebyscore('online', '+inf', ago, function(err, users){
        if (err) return next(err);
        req.online = users;
        next();
    });
});

router.get('/', function(req, res){
    res.send(req.online.length + ' users online');
});

module.exports = router;
//app.listen(3000);
