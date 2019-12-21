const { validationResult } = require('express-validator/check')
const Post = require('../models/post')

exports.getPost = (req, res, next) => {

  // Post.find()
  //   .then(results => {

  //   })
  //   .catch(err => {
  //   console.log(err)
  // })
  res.status(200).json({
    posts: [{
      _id: "1",
      title: "First Post",
      content: "This is the first post",
      imageUrl: 'images/image.jpg',
      creator: {
        name: 'emex',

      },
      createdAt: new Date()
    }]
  });
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array()
    })
  }
  const title = req.body.title
  const content = req.body.content

  //crest post in ths databse 
  const post = new Post({
    title: title,
    imageUrl: 'images/dck.jpg',
    content: content,
    creator: {
      name: 'emex'
    },
  })
  post.save()
    .then(result => {
      console.log(result)
      res.status(201).json(
        {
          message: 'Post Created',
          post: result
        });
    })
    .catch(err => {
      console.log(err)
    })

}
