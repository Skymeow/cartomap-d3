const router = require('express').Router();

// router.use('/api', require('./controllers/api'));
router.use('/', require('./controllers/home'));


module.exports = router;
