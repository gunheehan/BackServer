const database = require('../config/database')

class UserRepository{
    async findById(id){
        const pool = database.getPool();
        const [rows] = await pool.execute(
            'SELECT id, name, password FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }
    
    async create(userData){
        const pool = database.getPool();

        const [result] = await pool.execute(
            'INSERT INTO users (id, name, age, password) VALUES (?, ?, ?, ?)',
            [userData.id, userData.name, userData.age, userData.password]
        );
        
        return result;
    }

    async existsById(id) {
        const pool = database.getPool();
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE id = ?',
            [id]
        );
        return rows[0].count > 0;
    }
}

module.exports = UserRepository;