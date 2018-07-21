const marked = require('marked')
const Comment = require('../lib/mongo').Comment

// 将 comment 的 content从markdown转成html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.contect = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建一个留言
  create: function (comment) {
    return Comment.create(comment).exec()
  },

  // 通过留言id获取留言
  getCommentById: function (commentId) {
    return Comment.findOne({_id: commentId}).exec()
  },

  // 通过留言id删除留言
  delCommentById: function (commentId) {
    return Comment.deleteOne({ _id: commentId }).exec()
  },

  // 通过文章id删除所有留言
  delCommentsByPostId: function (postId) {
    return Comment.deleteMany({postId: postId}).exec()
  },

  // 通过文章id获取所有留言 按创建时间升序
  getComments: function (postId) {
    return Comment
      .find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 通过文章id获取留言数
  getCommentsCount: function (postId) {
    return Comment.count({postId: postId}).exec()
  }
}