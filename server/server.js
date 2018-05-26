"use strict";
const express       = require('express');
const socketIO      = require('socket.io');
const path          = require('path');
const http          = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('A user has disconnected');
    });

    // Welcome message
    socket.emit('newMessage', {
        from: 'Chat App',
        text: 'Welcome to the Chat App',
        createdAt: new Date()
    });

    // New user joined message
    socket.broadcast.emit('newMessage', {
        from: 'Chat App',
        text: 'New user joined',
        createdAt: new Date()
    });

    // Message created broadcast
    socket.on('createMessage', (message) => {
        message.createdAt = new Date();
        socket.broadcast.emit('newMessage', message);
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});