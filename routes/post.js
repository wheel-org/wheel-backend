var router = require('express').Router();
var fb   = require('../firebase').database();

router.post('/', function(req, res) {
    var data = {
        person: req.body.person,
        amount: req.body.amount,
        desc: req.body.desc,
        date: new Date().getTime()
    };
    //do validation here

    fb.ref('/count').once('value', function(count) {
        var asdf = fb.ref('/data').push(data, function(err) {
            if(err) console.log(err);
            else {
                console.log(data);
                var newCount = count.val();
                newCount[data.person] =
                    Math.round(100 * (parseFloat(newCount[data.person]) + parseFloat(data.amount))) / 100;
                fb.ref('/count').set(newCount, function(err) {
                    if(err) console.log(err);
                    else res.send('Thanks');
                })
            }
        });
        console.log(asdf.key);
    }, function(err) {
        console.log(err.code);
        res.send('Error retrieving count');
    });
});

module.exports = router;
