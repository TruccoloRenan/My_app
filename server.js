const express= require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs');
const forceSsl = require('express-force-ssl');
//const cors = require('cors');

//app.use(cors);
app.use(express.static(path.join(__dirname, 'build')));
//app.use(forceSsl);


app.get('/ping', function (res,req) {
    return res.send('pong');
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/express_backend', (req, res) => {
    res.send({ express: 'your express backend is conected to react'});

});

//const https = require("https");

//const options = {
   // key:fs.readFileSync('./ssl/localhost.key'),
   // cert: fs.readFileSync('./ssl/localhost.crt')
//}

//https.createServer(app).listen(443);
//console.log("https server start on port 443");

var http = require('http');
http.createServer(app).listen(9090);
console.log("http server start on port 9090");