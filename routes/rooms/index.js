var router = require("express").Router();

router.use('/create', require('./create'));
router.use('/join', require('./join'));
router.use('/get', require('./get'));
router.use('/leave', require('./leave'));
//router.use('/delete', require('./delete'));
//router.use('/update', require('./update'));

module.exports = router;
