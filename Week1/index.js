const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())

app.get('/', function (req, res) {
    res.send('Hello World')
})
app.get('/dog', function (req, res) {
    res.send('<h2>멍멍</h2>')
})
app.get('/cat', function (req, res) {
    res.json({
        'sound' : "야옹"
    })
})
app.get('/user/:id', function (req, res) {
    // const q = req.params
    // console.log(q.id)
    
    const q = req.query;
    console.log(q);
    
    res.send({'userid' : q.id})
})

app.get('/sound/:name',(req, res)=>{
    const {name} = req.params
    
    if(name == "dog")
        res.json({'sound' : '멍멍'})
    
    else if(name == "cat")
        res.json({'sound' : '야용'})
    
    else if(name == "pig")
        res.json({'sound' : '꿀꿀'})
    
    else
        res.json({'sound' : '알수없음'})
    
    console.log(name)
})

app.post('/user/:id', function (req, res) {
    const p = req.parms;
    console.log(p);
    const b = req.body;
    console.log(b);

    res.send({'message' : 'Hello'})
})
app.listen(3000)