var router = require("express").Router();

router.use('/create', require('./create'));
router.use('/join', require('./join'));
router.use('/add', require('./add'));
router.use('/get', require('./get'));

module.exports = router;
