var router = require('express').Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/get', require('./get'));
router.use('/add', require('./post'));
router.use('/delete', require('./delete'));

module.exports = router;
