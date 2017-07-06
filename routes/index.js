var router = require("express").Router();
var isAuth = require('../auth.js');

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/picture', isAuth, require('./picture'));
router.use('/rooms', isAuth, require('./rooms'));
router.use('/transactions', isAuth, require('./transactions'));

router.post('/auth', isAuth, function (req, res, next) {
    res.send({
        success: true,
        data: req.user
    });
});

module.exports = router;
