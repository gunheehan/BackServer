const express = require('express')
const mysql = require('mysql2')
const path = require('path')
const static = require('serve-static')
const config = require("../SigninModule/config/dbconfig.json");

const pool = mysql.createPool({
    connectionLimit : 10,
    host : config.host,
    port : '3306',
    user : config.user,
    password : config.password,
    database : config.database,
    connectTimeout: 60000
});

const app = express()
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
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('public', static(path.join(__dirname, 'public')))

app.post('/chartdatafromdb',(req, res)=>{
    pool.getConnection((err, conn)=>{
        console.log('Get Request')
        
        const bid = req.body.bid
        console.log('bid is %s', bid)
        
        const resData = {}
        resData.result = 'error'
        resData.temp = []
        resData.reg_date = []
        
        if(err){
            conn.release()
            console.log('Mysql getconnection error')
            res.json(resData)
            return;
        }
        
        const exec = conn.query('SELECT temperature, reg_date FROM Building_Temperature WHERE building_id = ? ORDER BY reg_date asc;',
            [bid],
            (err, rows)=>{
            conn.release()
            if(err){
                console.log('Mysql query error')
                res.json(resData)
                return;
            }
            
            if(rows[0]){
                resData.result = 'ok'
                rows.forEach((val)=>{
                    resData.temp.push(val.temperature)
                    resData.reg_date.push(val.reg_date)
                })
            }
            else{
                resData.result = 'none'
            }
            console.log("Success Data Get")
            return res.json(resData)
            })
    })
})

app.listen(3001,()=>{
    console.log('Server started at 3001')
})