var router = require('express').Router();
var fb   = require('../firebase').database();

router.get('/', function(req, res) {
    fb.ref('/data').orderByKey()/*.limitToLast(3)*/.once('value', function(snap) {
        var data = snap.val();

        fb.ref('/count').once('value', function(count) {
            var currCount = count.val();
            var newData = '';

            for(var id in data){
                if(data.hasOwnProperty(id)){
                    var key = id;
                    var person = data[id].person;
                    var amount = data[id].amount;
                    var desc = data[id].desc;
                    var date = data[id].date;
                    // TODO: format data correctly

                    newData = '\n' + id + '|' + person + '|' + amount + '|' + date + '|' + desc + newData;
                }
            }

            newData = currCount[0] + '|' + currCount[1] + newData;

            res.send(newData);
        }, function(err) {
            console.log("2: " + err.code);
            res.send('Error retrieving count');
        });
    }, function(err) {
        console.log("1: " + err.code);
        res.send('Error retrieving');
    });

});

module.exports = router;
