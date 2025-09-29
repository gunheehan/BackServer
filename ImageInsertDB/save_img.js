const mysql = require('mysql2')
const fs = require('fs')
const dbconfig = require('../SigninModule/config/dbconfig.json')

const connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
})

const dog = {
    img: fs.readFileSync('./dog.jpeg'),
    name: 'Dog'
}

const query = connection.query('INSERT INTO Animals SET ?',
    dog, (err, result)=>{
    if(err){
        console.dir(err)
        return
    }
    
    console.log('이미지를 db 추가 성공: ')
        console.dir(result)
    })

connection.end()