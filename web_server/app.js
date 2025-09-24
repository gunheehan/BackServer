// npm init -y : npm 설치
// npm install express --save : express 설치
// npm install -g nodemon : 

const express = require('express')
const app = express()

// pages로 들어오는 요청에 대해서는 로컬 폴더 __dirname + pages위치로 이동
app.use('/pages', express.static(__dirname +'/pages'))

app.listen(3000, ()=>{
    console.log('some call me')
})

app.get('/', (req, res)=>{
    res.sendStatus(500)
})

app.get('/about',(req, res)=>{
    res.sendFile(__dirname + '/pages/about.html')
})

app.get('/working',(req, res)=>{
    res.sendFile(__dirname + '/pages/working.html')
})