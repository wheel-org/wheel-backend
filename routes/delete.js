var router = require('express').Router();
var fb   = require('../firebase').database();

router.post('/', function(req, res) {
    console.log(req.body);
    var id = req.body.id;
    fb.ref('/data').child(id).once('value', function(data) {
        console.log(data.val());
        var person = data.val().person;
        var amount = parseFloat(data.val().amount);
        fb.ref('/data').child(id).remove();
        fb.ref('/count').once('value', function(count) {
            var newCount = count.val();
            newCount[person] = Math.round(100 * (parseFloat(newCount[person]) - amount)) / 100;
            fb.ref('/count').set(newCount, function(err) {
                if(err) console.log(err);
                else res.send('Deleted');
            });
        });
    });
});

module.exports = router;
