const mysql = require('mysql2');
const config = require('./dbconfig.json');

class Database{
    constructor(){
        this.pool = null;
    }
    
    async initialize(){
        this.pool = mysql.createPool({
            connectionLimit : 10,
            host : config.host,
            port : '3306',
            user : config.user,
            password : config.password,
            database : config.database,
            connectTimeout: 60000
        });
    }
    
    getPool(){
        if(!this.pool){
            throw new Error('Database not initialized');
        }

        return this.pool;
    }
}

module.exports = new Database();