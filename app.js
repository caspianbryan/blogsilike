const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter =require('./controllers/blog')
const middleware = require('./utils/middleware')
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

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app