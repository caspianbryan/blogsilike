const logger = require('./logger')

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') { // Fix typo here
        return res.status(401).json({ error: 'Invalid token' });
    }
    next(error);
};

module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger,
};


module.exports = {
    errorHandler, unknownEndpoint, requestLogger
}