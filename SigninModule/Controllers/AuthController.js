const AuthService = require('../services/AuthService');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    login = async (req, res, next) => {
        try {
            const { id, password } = req.body;

            console.log(`Login attempt for user: ${id}`);

            const user = await this.authService.login({ id, password });

            console.log(`Login successful for user: ${user.id}`);

            res.json(ApiResponse.success(user, 'Login successful'));
        } catch (error) {
            next(error); // 에러 미들웨어로 전달
        }
    }

    register = async (req, res, next) => {
        try {
            const userData = req.body;

            console.log(`Registration attempt for user: ${userData.id}`);

            const result = await this.authService.register(userData);

            console.log(`Registration successful for user: ${result.id}`);

            res.status(201).json(ApiResponse.success(result, 'User registered successfully'));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;