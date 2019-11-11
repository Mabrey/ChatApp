const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const shortid = require('shortid');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let users = 0;

let rooms = {};

let clients = {};

// wss.on('connection', (ws) => {
//     ws.on('message', (message) =>{
//         console.log('recieved: %s', message);
//         ws.send(`Hello, you sent -> ${message}`);
//     });
//     ws.send('Hi, I am a ws server!');
// });

let room = (member, id) => {
    return {member:{member}, roomID: id}
}

let member = (memberID, connection='') => {
    return {memberID: memberID, connection: connection}
}


wss.on('connection', (ws, req) => {
    ws.on('message', function incoming(message){
        wss.clients.forEach(function each(client) {
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(message);
            }
        } )
    });
    ws.send('Hi, I am a ws server!');
});

server.listen(port, () => console.log(`Listening on port ${port}`));


app.get('/express_backend', (req, res) => {
    res.send({express: 'Your Express Backend Works'});
});

app.get('/create_user_id', (req, res) => {
    let userID = shortid.generate();
    res.send({userID: `${userID}`})
});

app.get('/create_room', (req, res) => {
    let roomID = shortid.generate();
    let member = member(req.memberID);
    let room = room(req.clientID, roomID)
    res.send({roomID: `${roomID}`})
});
