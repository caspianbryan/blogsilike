const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter =require('./controllers/blog')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
var colors = require('colors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// logger.info('Connecting to', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL).then(() => {
    logger.info('Connected to MongoDB'.brightCyan)
}).catch((err) => {
    logger.error('Error connecting to MongoDB', err.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)


app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app