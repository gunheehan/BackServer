const express = require('express');
const mysql = require('mysql2')
const bcrypt = require('bcrypt');
const path = require('path')
const static = require('serve-static')
const dbconfig = require('./config/dbconfig.json')

// Database connection pool
const pool = mysql.createPool({
    connectionLimit : 10,
    host: dbconfig.host,
    port: 3306,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug:false
})

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('public', static(path.join(__dirname, 'public')))

app.post('/process/login',(req, res)=>{
    const paramId = req.body.id;
    const paramPassword = req.body.password;
    
    console.log('로그인 요청 : ' + paramId + ' ' + paramPassword);
    
    pool.getConnection(async (err,conn)=>{
        if(err){
            conn.release();
            console.log('Mysql getconnection error, aborted : ' + error);
            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'});
            res.write('<h1>DB 연결실패</h1>');
            res.end();
            return;
        }

        conn.query("SELECT id, name, password FROM users WHERE id = ?",
            [paramId],
            async (err, rows) => {
                conn.release();
                if (err) {
                    console.dir(err);
                    res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'})
                    res.write('<h1> SQL query 실행 실패</h1>');
                    res.end();
                    return;
                }

                if (rows.length > 0) {
                    const isPasswordValid = await bcrypt.compare(paramPassword, rows[0].password);
                    if(isPasswordValid){
                        console.log('사용자 [%s], 패스워드 찾음', rows[0].name);
                        res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
                        res.write('<h2>로그인 성공</h2>');
                        res.end();
                        return;
                    }

                } 
                    console.log('아이디 [%s], 패스워드 없음', paramId);
                    res.writeHead('200', {'Content-Type': 'text/html; charset=utf8'});
                    res.write('<h2>로그인 실페</h2>');
                    res.end();
            })
    })
})

app.post('/process/adduser', (req, res)=>{
    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;
    
    pool.getConnection(async (error, conn)=>{
        if(error){
            conn.release();
            console.log('Mysql getconnection error, aborted : ' + error);
            res.writeHead('200',{'Content-Type':'text/html; charset=utf8'});
            res.write('<h1>DB 연결실패</h1>');
            res.end();
            return;
        }

        console.log('database connect success');
        const hashedPassword = await bcrypt.hash(paramPassword, 10);
        const sql = 'INSERT INTO users (id, name, age, password) VALUES (?, ?, ?, ?)';
        const params = [paramId, paramName, paramAge, hashedPassword];

        console.log('SQL Query:', sql);  // ⭐️ 이렇게 수정
        console.log('Parameters:', params);

        conn.query(sql, params, (error, results) => {
                conn.release();

                if(error){
                    console.log('SQL Error : ' + error);
                    res.writeHead('200',{'Content-Type':'text/html; charset=utf8'});
                    res.write('<h1>사용자 실행 실패</h1>');
                    res.end();
                }
                
                if(results){
                    console.dir(results);
                    console.log('Inserted 성공');

                    res.writeHead('200',{'Content-Type':'text/html; charset=utf8'});
                    res.write('<h2>사용자 추가 성공</h2>');
                    res.end();
                }
                else{
                    console.log('Inserted 실패');

                    res.writeHead('200',{'Content-Type':'text/html; charset=utf8'});
                    res.write('<h1>사용자 추가 실패</h1>');
                    res.end();
                }
            });
    })
})

app.listen(3000,()=>{
    console.log('Listning 3000');
})