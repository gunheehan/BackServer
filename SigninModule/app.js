const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middlewares/errorHandler');

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
    }

    async initialize() {
        // 데이터베이스 초기화
        await database.initialize();

        // 미들웨어 설정
        this.setupMiddlewares();

        // 라우트 설정
        this.setupRoutes();

        // 에러 핸들러 (마지막에)
        this.app.use(errorHandler);
    }

    setupMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupRoutes() {
        this.app.use('/api/auth', authRoutes);

        // 헬스체크
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Server running on port ${this.port}`);
        });
    }
}

// 애플리케이션 시작
async function startServer() {
    try {
        const app = new App();
        await app.initialize();
        app.start();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();