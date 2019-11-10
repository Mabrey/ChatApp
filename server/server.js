const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 5000;
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let users = 0;

wss.on('connection', (ws) => {
    ws.on('message', (message) =>{
        console.log('recieved: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
    ws.send('Hi, I am a ws server!');
});

server.listen(port, () => console.log(`Listening on port ${port}`));


app.get('/express_backend', (req, res) => {
    res.send({express: 'Your Express Backend Works'});
});

app.get('/get_user_number', (req, res) => {
    users++;
    res.send({express: `${users}`})
});


