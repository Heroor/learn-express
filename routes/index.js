module.exports = function (app) {
  app.use((req, res, next) => {
    console.log('进入路由...')
    next()
  })
  app.get('/', (req, res, next) => {
    res.redirect('/posts')
  })
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))

  app.get('/test', (req, res, next) => {
    res.render('../views/test', {
      luluDep: ['Dialog']
    })
  })
}
