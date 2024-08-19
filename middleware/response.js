module.exports = response = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
    });
}