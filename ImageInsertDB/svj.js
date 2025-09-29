const express = require('express')
const mysql = require('mysql2')
const path = require('path')
const static = require('serve-static')
const dbconfig = require('../SigninModule/config/dbconfig.json')
const repl = require("node:repl");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
})

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public', static(path.join(__dirname, 'public')))

// CORS 설정 추가
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.post('/getimagefromdb',(req, res)=>{
    
    console.log("Get Request")
    
    pool.getConnection((err, conn)=>{
        const query_str = 'SELECT * FROM Animals WHERE rid=1;'
        conn.query(query_str, (error, rows, fields)=>{
            if(error){
                conn.release()
                console.dir(error)
                res.status(401).json('Query failed')
                return;
            }
            
            const reply ={
                'result': rows
            }
            
            res.status(200).json(reply)
            conn.release()
        })
    })
})

app.listen(3000,()=>{
    console.log('server started 3000')
})