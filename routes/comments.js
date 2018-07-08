const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check.js').checkLogin

// POST 创建留言
router.post('/', checkLogin, (req, res, nxt) => {
  res.send('创建留言')
})

// GET 删除留言
router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  res.send('删除留言')
})

module.exports = router
