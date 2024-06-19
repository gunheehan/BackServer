const express = require('express')
const app = express()

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
app.listen(3000)