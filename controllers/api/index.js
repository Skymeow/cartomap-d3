const router = require('express').Router();
const controller = require('./controller');

router.get('/',controller.getScoreByCity);

module.exports = router;
