require('dotenv').config()
const env = process.env
const path = require('path')
const express = require('express')
const feedRoutes = require('./routes/feed')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const authRoutes = require('./routes/auth')

const app = express()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace('.', '-').replace(':', '-').replace(':', '-') + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }

}
app.use(bodyParser.json())
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'))

app.use('/images', express.static(path.join(__dirname, 'images')))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)



app.use((error, req, res, next) => {

  const status = error.statuscode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message: message,
    data: data
  })
})



mongoose.connect(env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(results => {
    const server = app.listen(env.PORT || 8080, (req, res, next) => {
      console.log(`Port on ${env.PORT}`)
    })
    const io = require('./socket').init(server)
    io.on('connection', socket => {
      console.log('Client conneted')
    })
  })
  .catch(err => {
    console.log(err)
  })

