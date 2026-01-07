class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidatorError extends AppError {
    constructor(message){
        super(message, 400);
        this.name = 'ValidatorError';
    }
}

class NotFoundError extends AppError {
    constructor(resource){
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

class DatabaseError extends AppError {
    constructor(message){
        super(message, 500);
        this.name = 'DatabaseError';
    }
}

const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        name: err.name, 
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack: undefined,
        url: req.originalUrl,
        method: req.method
    });

    if(err.isOperational){
        return res.status(err.statusCode).json({
            success: false, 
            error: err.message
        });
    }

    if (err.name === 'RequestError' || err.number){
        return res.status(500).json({
            success: false, 
            error: 'Database operation failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    return res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = {
    AppError, 
    ValidatorError, 
    NotFoundError, 
    DatabaseError, 
    errorHandler
}