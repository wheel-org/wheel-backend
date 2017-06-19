var router = require("express").Router();

router.use('/create', require('./create'));
router.use('/join', require('./join'));
router.use('/get', require('./get'));
router.use('/add', require('./add'));

module.exports = router;
