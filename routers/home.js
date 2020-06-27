const controllers = require('../controllers');
const router = require('express').Router()
const auth = require('../utils/auth')

router.get('/', controllers.home.get.home)
router.get('/home', controllers.home.get.home)

module.exports = router