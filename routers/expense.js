const controllers = require('../controllers');
const router = require('express').Router()
const auth = require('../utils/auth')

router.get('/all', auth(), controllers.expense.get.all)

router.get('/create', auth(), controllers.expense.get.create)
router.post('/create',auth(), controllers.expense.post.create)

 router.get('/report/:id', auth(false),  controllers.expense.get.report)

// router.get('/edit/:id', auth(),  controllers.expense.get.edit)
// router.post('/edit/:id', auth(),  controllers.expense.post.edit)
 router.get('/delete/:id', auth(),  controllers.expense.get.delete)

// router.post('/search',  controllers.expense.post.search)

module.exports=router