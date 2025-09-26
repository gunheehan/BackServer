const ApiResponse = require('../utils/ApiResponse');

const errorMessages = {
    'INVALID_CREDENTIALS': 'Invalid ID or password',
    'USER_ALREADY_EXISTS': 'User already exists',
    'MISSING_CREDENTIALS': 'ID and password are required',
    'MISSING_REQUIRED_FIELDS': 'All fields are required',
    'INVALID_ID_LENGTH': 'ID must be at least 3 characters',
    'INVALID_PASSWORD_LENGTH': 'Password must be at least 6 characters',
    'INVALID_AGE': 'Age must be between 1 and 120',
    'INVALID_INPUT_TYPE': 'Invalid input type'
};

function errorHandler(error, req, res, next) {
    console.error('Error:', error);

    // 알려진 비즈니스 에러
    if (errorMessages[error.message]) {
        const statusCode = getStatusCode(error.message);
        return res.status(statusCode).json(
            ApiResponse.error(errorMessages[error.message], error.message)
        );
    }

    // 데이터베이스 에러
    if (error.code && error.code.startsWith('ER_')) {
        return res.status(500).json(
            ApiResponse.error('Database error occurred', 'DATABASE_ERROR')
        );
    }

    // 기타 에러
    res.status(500).json(
        ApiResponse.error('Internal server error', 'INTERNAL_ERROR')
    );
}

function getStatusCode(errorCode) {
    const statusMap = {
        'INVALID_CREDENTIALS': 401,
        'USER_ALREADY_EXISTS': 409,
        'MISSING_CREDENTIALS': 400,
        'MISSING_REQUIRED_FIELDS': 400,
        'INVALID_ID_LENGTH': 400,
        'INVALID_PASSWORD_LENGTH': 400,
        'INVALID_AGE': 400,
        'INVALID_INPUT_TYPE': 400
    };

    return statusMap[errorCode] || 500;
}

module.exports = errorHandler;