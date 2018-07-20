const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check.js').checkLogin

// GET 登出
router.get('/', checkLogin, (req, res, next) => {
  // 清空 sessijon 用户信息
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/posts')
})

module.exports = router
