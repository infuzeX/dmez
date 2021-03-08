const AppError = require("../utils/appError");

const handleCastErrorDB = (error) => {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
};

const handleDupErrorDB = (error) => {
    const prop = Object.keys(error.keyValue)[0];
    const message = `${prop} value already exist, please use another value`;
    return new AppError(message, 400);
};

const handleInvalidErrorDB = (error) => {
    const err = Object.values(error.errors).map(er => `${er.message}`)
    const message = `Invalid inputs. ${err.join(', ')}`;
    return new AppError(message, 400);
}

const handleTokenError = () => new AppError("Invalid token, please login again", 401)
const handleTokenExpiredError = () => new AppError("Your token has expired, please login again", 401)

const sendErrorProd = (res, err) => {

    if (err.isOperational) {
        //operational error, trusted error: send message to client
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        //Programming error or other unknown error
        //log to check error
        console.log("ERROR : \n", err);
        //then send to client
        res.status(500).json({
            status: "error",
            message: "Something went very wrong",
        });
    }
};

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};


//main error handler
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "production") {
        let error = null;
        //Error handlers
        const errname = {
            "CastError": handleCastErrorDB,
            "ValidationError": handleInvalidErrorDB,
            "JsonWebTokenError": handleTokenError,
            "TokenExpiredError": handleTokenExpiredError
        }
        const errcode = { "11000": handleDupErrorDB }
        //find error handlere
        const errorHandler = (errname[err.name] || errcode[err.code])
        //make error message more easy to understand
        if (errorHandler) error = errorHandler({ ...err })
        //send back error in production
        sendErrorProd(res, error || err);
    }
    //send error in development
    else sendErrorDev(res, err);
};
