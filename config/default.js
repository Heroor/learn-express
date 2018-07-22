module.exports = {
  // 监听的端口
  port: 3000,
  // express-session 的配置信息
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  // mongodb 的地址，以 mongodb:// 协议开头，myblog 为 db 名
  mongodb: 'mongodb://localhost:27017/myblog'
  // mongodb: 'bdm27163517.my3w.com'
}
