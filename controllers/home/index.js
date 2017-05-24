const router = require('express').Router();

const controller = require('./controller');
// const controllerapi = require('../api/controller');

router.get('/', controller.index);

module.exports = router;
