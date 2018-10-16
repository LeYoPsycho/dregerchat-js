//main.js
let UserCollection = require('./userCollection');

//imports
let WebSocket = require('ws');

//instances
let wss = new WebSocket.Server({
    port: 80
});

//variables
let users = new UserCollection();

//functions
function getTimestamp(){
    var date = new Date();
    let hours, minutes;
    if (date.getHours() < 10){
        hours = `0${date.getHours()}`;
    } else {
        hours = date.getHours();
    }
    if (date.getMinutes() < 10){
        minutes = `0${date.getMinutes()}`;
    } else {
        minutes = date.getMinutes();
    }
    return `${hours}:${minutes}`;
}

//return json string
function parseMessage(msg, username){
    let obj = {
        from: username,
        time: getTimestamp(),
        message: msg
    }
    return JSON.stringify(obj);
}

//when new client connects
wss.on('connection', (ws, req) => {
    console.log('Client connected');
    var username = req.url.slice(req.url.indexOf('=') + 1, req.url.length);
    let shownName = users.addUser(username, ws).userId;
    console.log(shownName + ' has connected');

    //when client closes connection
    ws.on('close', () => {
        let closedUser = users.removeUser(shownName);
        console.log('Connection closed by ' + closedUser.userId);
    })

    //when client sends message
    ws.on('message', (msg) => {
        //Edit message object
        let msgObj = JSON.parse(msg);
        msgObj.from = shownName;
        let msgStr = JSON.stringify(msgObj);

        //send message to every client
        wss.clients.forEach((socket) => {
            socket.send(msgStr);
        });
    });
});

//when server is listening
wss.on('listening', (ws) => {
    console.log('Server is listening');
});