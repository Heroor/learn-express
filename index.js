const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
// const config = require('./config/default.js')
const routes = require('./routes')
const pkg = require('./package')

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎
app.set('view engine', 'ejs')

// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存session id的字段名
  secret: config.session.secret, // 设置secret类计算hash值并放在cookie， 放置篡改
  resave: true, // 强制更新
  saveUninitialized: false, // 设置false 强制创建一个session 即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间 过期后cookie中的session id走动删除
  },
  store: new MongoStore({
    url: config.mongodb // mongod地址
  })
}))

// flash 中间件
app.use(flash())

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))

// 设置模板全局变量
app.locals.blog = {
  title: pkg.name,
  desc: pkg.description
}

// 添加模板必须的三个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 路由
routes(app)

app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}...`)
})
