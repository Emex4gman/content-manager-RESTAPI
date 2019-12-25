const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator/check')
const Post = require('../models/post')
const User = require('../models/user')



exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const parPage = 2;
  try {
    const totalItems = await Post.find().countDocuments()

    const posts = await Post.find()
      .skip((currentPage - 1) * parPage)
      .limit(parPage)

    res.status(200).json({
      message: "Fetched posts success",
      posts: posts,
      totalItems: totalItems
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }

}

exports.createPost = async (req, res, next) => {
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
  try {


    await post.save()

    const user = await User.findById(req.userId)
    creator = user;
    await user.posts.push(post);

    res.status(201).json(
      {
        message: 'Post Created',
        post: post,
        creator: { _id: creator._id, name: creator.name }
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422
    }

    next(err);
  }

}

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId
  //console.log(postId)
  try {
    const post = await Post.findById(postId)

    if (!post) {
      const error = new Error('Post Was Not Found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({
      message: "Post Fetched ",
      post: post
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }

}

exports.updatePost = async (req, res, next) => {
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
  try {


    const post = await Post.findById(postId)

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

    const result = await post.save();
    res.status(200).json({
      message: 'Post Updated',
      post: result
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422
    }
    next(err);
  }
}


exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId

  try {
    const post = await Post.findById(postId)

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

    await Post.findByIdAndRemove(postId)

    const user = await User.findById(req.userId)
    user.post.push(postId)

    await user.save()

    res.status(200).json({
      message: 'Post Deleted'
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 422
    }

    next(err);
  }

}
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => {
    console.log(err)
  })
}