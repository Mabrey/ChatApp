const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const shortid = require('shortid');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let users = 0;

let rooms = [];

let clients = [];

let room = (user, id) => {
    return {users:[user], roomID: id}
}

let user = (userID, connection='') => {
    return {userID: userID, connection: connection}
}

let addRoom = (room) => {
    rooms.push(room);
}

let createUserID = () => {
    return shortid.generate();
}

wss.on('connection', (ws, req) => {
    ws.on('message', function incoming(message){
        console.log(message);
        wss.clients.forEach(function each(client) {
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(message);
            }
        } )
    });

    let client = user(createUserID(), ws);
    clients.push(client);
    ws.send(JSON.stringify({clientID: client.userID}));

});

server.listen(port, () => console.log(`Listening on port ${port}`));


app.get('/express_backend', (req, res) => {
    res.send({express: 'Your Express Backend Works'});
});

app.get('/get_user_id', (req,res) => {

})

app.get('/create_room', (req, res) => {
    let roomID = shortid.generate();
    let user = clients.find(userFilter => userFilter.userID === req.query.userID);
    let userRoom = room(user, roomID);
    addRoom(userRoom);
    console.log(`Player ${user.userID} has created room ${roomID}`)
    res.send({roomID: `${roomID}`});
});

app.get('/join_room', (req, res) => {
    let roomID = req.query.roomID;
    let user = clients.find(userFilter => userFilter.userID === req.query.userID);
    rooms.forEach((room, index) =>{
        if(room.roomID === roomID){ rooms[index].users.push(user);}
    })
    // rooms[roomID].users.push(user);
    res.send({roomJoinStatus: 'Success'})
});

app.get('/is_room_active', (req, res) => {
    let roomID = req.query.roomID;
    let foundRoom = false;
    foundRoom = rooms.some((room) => room.roomID === roomID);
    console.log(`Found room: ${foundRoom}`);

    res.send({foundRoom: `${foundRoom}`});

})
