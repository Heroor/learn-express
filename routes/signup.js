const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin

// GET 注册页
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup')
})

// POST 注册
router.post('/', checkNotLogin, (req, res, next) => {
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限 30 字符以内')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 位')
    }
    if (password !== repassword) {
      throw new Error('两次密码不一致')
    }
  } catch (err) {
    // 异步删除头像文件
    fs.unlink(req.files.avatar.path)
    req.flash('error', err.message)
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name,
    password,
    gender,
    bio,
    avatar
  }

  // 用户信息写入数据库
  UserModel.create(user)
    .then(result => {
      // user 是插入 mongod 后的值
      user = result.ops[0]
      // 删除密码 将用户信息存入session
      delete user.password
      req.session.user = user
      // 写入flash
      req.flash('success', '注册成功')
      res.redirect('/posts')
    })
    .catch(err => {
      // 删除头像文件
      fs.unlink(req.files.avatar.path)
      if (err.message.match('duplicate key')) {
        req.flash('error', '用户名已占用')
        return res.redirect('/signup')
      }
      next(err)
    })
})

module.exports = router
