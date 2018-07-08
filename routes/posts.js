const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check.js').checkLogin

router.get('/', (req, res, next) => {
  res.send('主页')
})

// POST 添加文章页
router.post('/create', checkLogin, (req, res, next) => {
  res.send('发表文章')
})

// GET 发表文章
router.post('/create', checkLogin, (req, res, next) => {
  res.send('发表文章页')
})

// GET 文章详情
router.get('/:postId', (req, res, next) => {
  res.send('文章详情页')
})

// GET 编辑文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  res.send('更新文章')
})

// POST 修改文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  res.send('更新一文篇章')
})

// POST 删除文章
router.post('/:postId/remove', checkLogin, (req, res, next) => {
  res.send('删除文章')
})

module.exports = router
