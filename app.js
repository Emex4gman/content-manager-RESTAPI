require('dotenv').config()
const env = process.env
const express = require('express')
const feedRoutes = require('./routes/feed')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')



const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

app.use('/feed', feedRoutes)







mongoose.connect(env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(results => {
    app.listen(8080, (req, res, next) => {
      console.log('Port on 8080')
    })
  })
  .catch(err => {
    console.log(err)
  })

