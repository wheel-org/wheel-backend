var router = require("express").Router();

router.use('/name', require('./name'));
router.use('/password', require('./password'));

module.exports = router;
