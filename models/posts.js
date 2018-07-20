const Post = require('../lib/mongo').Post
const marked = require('marked')

// 将 post 的 content md 转换成html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  aferFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  // 创建一遍文章
  create: function (post) {
    return Post.create(post).exec()
  },

  // 通过文章id获取详情
  getPostById: function (postId) {
    return Post
      .findOne({
        _id: postId
      })
      .populate({
        path: 'author',
        model: 'User'
      })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 按创建时间降序获取所有用户文章或特定用户所有文章
  getPosts: function (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 通过文章id给pv加 1
  incPv: function (postId) {
    return Post
      .update({_id: postId}, {$inc: {pv: 1}})
      .exec()
  },

  // 通过文章 id 获取文章详情 （编辑）
  getRawPostById: function (postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .exec()
  },

  // 更新文章
  updatePostById: function (postId, data) {
    return Post.update({_id: postId}, {$set: data}).exec()
  },

  // 删除文章
  delPostById: function (postId) {
    return Post.deleteOne({_id: postId}).exec()
  }
}
