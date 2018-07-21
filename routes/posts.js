const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')
const CommentModel = require('../models/comments')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', (req, res, next) => {
  const author = req.query.author
  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
    .catch(next)
})

// GET 添加文章页
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create')
})

// GET 发表文章
router.post('/create', checkLogin, (req, res, next) => {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  // 效验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author: author,
    title: title,
    content: content
  }

  PostModel.create(post)
    .then(function (result) {
      // 将post插入到mongodb 包含_id
      post = result.ops[0]
      req.flash('success', '发表成功')
      // 跳转到文章页
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})

// GET 文章详情
router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId
  Promise.all([
    PostModel.getPostById(postId),
    CommentModel.getComments(postId), // 获取文章所有留言
    PostModel.incPv(postId) // 加一
  ]).then(function (result) {
    const post = result[0]
    const comments = result[1]
    if (!post) {
      throw new Error('该文章不存在')
    }
    res.render('post', {
      post: post,
      comments: comments
    })
  })
    .catch(next)
})

// GET 编辑文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在')
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足')
      }
      res.render('edit', {
        post: post
      })
    })
    .catch(next)
})

// POST 修改文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
})

// POST 删除文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id
  console.log(postId)
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.delPostById(postId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/posts')
        })
        .catch(next)
    })
})

module.exports = router
