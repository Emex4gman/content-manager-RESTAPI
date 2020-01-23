const express = require('express')


const serverless = require('serverless-http');
const app = express()
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString().replace('.', '-').replace(':', '-').replace(':', '-') + '-' + file.originalname)
//   }
// })

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//     cb(null, true)
//   } else {
//     cb(null, false)
//   }

// }
// app.use(bodyParser.json())
// app.use(multer({
//   storage: fileStorage,
//   fileFilter: fileFilter
// }).single('image'))

// app.use('/images', express.static(path.join(__dirname, 'images')))


// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next()
// })
const routes = express.Router();

routes.get('/', (req, res) => {
  res.json({
    messahe: "hello"
  })
})

routes.get('/feed', (req, res) => {
  res.json({
    messahe: "feeed"
  })
})

app.use('/.netlify/functions/app/feed', routes)
//app.use('/.netlify/functions/app/auth', authRoutes)






//module.exports.handler = serverless(app);