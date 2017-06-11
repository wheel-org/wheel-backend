var router = require("express").Router();

router.use('/create', require('./create'));
router.use('/join', require('./join'));

module.exports = router;
