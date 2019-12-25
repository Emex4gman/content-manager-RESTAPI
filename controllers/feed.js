const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator/check')
const Post = require('../models/post')
const User = require('../models/user')



exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const parPage = 2;
  let totalItems

  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * parPage)
        .limit(parPage)
    })
    .then(posts => {
      console.log(posts)
      res.status(200).json({
        message: "Fetched posts success",
        posts: posts,
        totalItems: totalItems
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })

}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422
    throw error;
  }
  if (!req.file) {
    const error = new Error('No Image Was Provided')
    error.statusCode = 422;
    throw error
  }
  const imageUrl = req.file.path.replace('\\', '\/');
  const title = req.body.title
  const content = req.body.content
  let creator
  //crest post in ths databse 
  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.userId,
  })
  post.save()
    .then(result => {
      return User.findById(req.userId)
    })
    .then(user => {
      creator = user
      return user.posts.push(post)
    })
    .then(result => {

      res.status(201).json(
        {
          message: 'Post Created',
          post: post,
          creator: { _id: creator._id, name: creator.name }
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 422
      }

      next(err);
    })
}

exports.getPost = (req, res, next) => {
  const postId = req.params.postId
  //console.log(postId)
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post Was Not Found')
        error.statusCode = 404
        throw error
      }
      res.status(200).json({
        message: "Post Fetched ",
        post: post
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })


}

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422
    throw error;
  }
  const title = req.body.title
  const content = req.body.content
  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '\/');
  }
  if (!imageUrl) {
    const error = new Error('No FIle Picked')
    error.statusCode = 422
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post Was Not Found')
        error.statusCode = 404
        throw error
      }
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error('Not Authorized')
        error.statusCode = 403
        throw error

      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }
      post.title = title
      post.content = content
      post.imageUrl = imageUrl
      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Post Updated',
        post: result
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 422
      }

      next(err);
    })
}


exports.deletePost = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post Was Not Found')
        error.statusCode = 404
        throw error
      }
      //check logged in user
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error('Not Authorized')
        error.statusCode = 403
        throw error

      }
      clearImage(post.imageUrl)
      return Post.findByIdAndRemove(postId);
    }).then(result => {
      return User.findById(req.userId)

    }).then(user => {
      user.post.push(postId)
      return user.save()
    })
    .then(result => {
      res.status(200).json({
        message: 'Post Deleted'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 422
      }

      next(err);
    })

}
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => {
    console.log(err)
  })
}