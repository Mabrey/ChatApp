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
    return {userID: userID, connection: connection, isAlive: true}
}

let addRoom = (room) => {
    rooms.push(room);
}

let createUserID = () => {
    return shortid.generate();
}

wss.on('connection', (ws, req) => {
    ws.on('message', function incoming(message){
        let msgJSON = JSON.parse(message);
        let room = rooms.find((room) => room.roomID === msgJSON.roomID);
        room.users.forEach(user => {
            if (user.connection !== ws && user.connection.readyState === WebSocket.OPEN){
                user.connection.send(message);
            }
        })

        // wss.clients.forEach(function each(client) {
        //     if(client !== ws && client.readyState === WebSocket.OPEN){
        //         client.send(message);
        //     }
        // } )
    });

    ws.on('pong', () =>  {

        let userIndex = clients.findIndex((user) => user.connection === ws);
        console.log(`received pong from ${clients[userIndex].userID}!`)
        clients[userIndex].isAlive = true;
    })

    let client = user(createUserID(), ws);
    clients.push(client);
    ws.send(JSON.stringify({clientID: client.userID}));

});

server.listen(port, () => console.log(`Listening on port ${port}`));

let pingClients = () => {
    clients.forEach((client, index)=>{
        if (client.isAlive === false) {
            console.log(`Terminating user ${client.userID} connection`);
            rooms.forEach((room, index) => {
                if(room.users.includes(client)){
                    let filteredUsers = room.users.filter(user => user.userID != client.userID);
                    rooms[index].users = filteredUsers;
                }
            });

            client.connection.terminate();
            clients.splice(index, 1);
            return;
        }

        clients[index].isAlive = false;
        client.connection.ping();
    })
};

const interval = setInterval(pingClients, 5000);

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
    let user;
    if(req.query.hasOwnProperty("userID")){
        user = clients.find(userFilter => userFilter.userID === req.query.userID);
        rooms.forEach((room, index) =>{
            if(room.roomID === roomID){
                rooms[index].users.push(user);

                console.log(`Player ${user.userID} has joined room ${room.roomID}`);
                console.log(`Players in room ${room.roomID}: `);
                rooms[index].users.forEach(user => {console.log(user.userID)});

                res.send({roomJoinStatus: 'Success'});
            }
        })
    }
    else {
        res.send({roomJoinStatus: 'Failed'});
    }

});

app.get('/leave_room', (req, res) =>{
    if(!req.query.hasOwnProperty('userID')
    || !req.query.hasOwnProperty('roomID')){
        res.send({roomLeaveStatus: 'Failed'});
    }

    let userID = req.query.userID;
    let roomID = req.query.roomID;

    rooms.forEach((room, index) => {
        if(room.roomID === roomID){
            let remainingUsers = rooms[index].users.filter( (user) => user !== userID)
            rooms[index].users = remainingUsers;
        }
    });
    console.log(`Player ${userID} has left room ${roomID}`);
    res.send({roomLeaveStatus: 'Success'});

})

app.get('/is_room_active', (req, res) => {
    let roomID = req.query.roomID;
    let foundRoom = false;
    foundRoom = rooms.some((room) => room.roomID === roomID);
    console.log(`Found room: ${foundRoom}`);

    res.send({foundRoom: `${foundRoom}`});

})
