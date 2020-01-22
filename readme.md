This uses mongodb database
Node
express

You also need to set your .env file in the manner belo

DB means Database url. if you have mongodb on your machine you can use this
mongodb://localhost:27017/post

SE_key means secret key for jsonwebtoken

DB=

SE_key=

# FEED END POINTS

GET /feed/posts

POST /feed/posts

GET /feed/post/:postId

PUT /feed/post/:postId

DELETE /feed/post/:postId

# AUTH END POINTS

PUT /auth/signup

POST /auth/login
