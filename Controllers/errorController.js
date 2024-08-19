const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    // const message = `Duplicate fields ${Object.keys(err.keyValue)}: ${Object.values(err.keyValue)}`;
    const message = `Duplicate field value: "${Object.keys(err.keyValue).join(', ')}". Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. please log in again!', 401);

const handleJWTExpiredError = () => new AppError('You token has expired!. please log in again!', 401);

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        data: null
    });
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            data: null
        });
        // Programing or other unknown error: don't leak error details
    } else {
        // * 1) Log error
        console.error('ERROR 💥', err);

        // * 2) Send generic message
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went very wrong!',
            data: null
        });
    }
}

module.exports = (err, req, res, next) => {
    //console.error(err.statck); // Show the stack trace

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

        // error.message = err.message;
        return sendErrorProd(error, res);
    }
}