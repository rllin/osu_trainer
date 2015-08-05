var express = require('express');
var router = express.Router();
var restify = require('restify');

var TargetModel = require('../db').TargetModel;
var StopModel = require('../db').StopModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/target', function(req, res) {
    var target = new TargetModel({
        timestamp: req.body.timestamp,
        email: req.body.email,
        state: req.body.state,
        content: req.body.data
    });
    target.save(function(err) {
        if (!err) {
            return res.send({status: 'OK'});
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({error:'Validation error'});
            } else {
                res.statusCode = 500;
                res.send({error: 'Server error'});
            }
        console.log('Internal error(%d): %s for %s', res.statusCode, err.message, JSON.stringify(req.body));
        }
    });
});

router.post('/api/stopgo', function(req, res) {
    var stop = new StopModel({
        timestamp: req.body.timestamp,
        email: req.body.email,
        state: req.body.state,
        content: req.body.data
    });
    stop.save(function(err) {
        if (!err) {
            return res.send({status: 'OK'});
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({error:'Validation error'});
            } else {
                res.statusCode = 500;
                res.send({error: 'Server error'});
            }
        console.log('Internal error(%d): %s for %s', res.statusCode, err.message, JSON.stringify(req.body));
        }
    });
});


module.exports = router;
