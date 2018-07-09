const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()

// 连接数据库
mongolass.connect(config.mongodb)

// 定义表
exports.User = mongolass.model('User', {
  name: {type: 'string', required: true},
  password: {type: 'string', required: true},
  avatar: {type: 'string', required: true},
  gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'},
  bio: {type: 'string', required: true}
})

exports.User.index({name: 1}, {unique: true}).exec()
