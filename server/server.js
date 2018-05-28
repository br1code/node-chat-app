"use strict";
const express           = require('express');
const socketIO          = require('socket.io');
const path              = require('path');
const http              = require('http');
const utilsMessage      = require('./utils/message');

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
    socket.emit('newMessage', utilsMessage.generateMessage('Admin', 'Welcome to the chat app'));

    // New user joined message
    socket.broadcast.emit('newMessage', utilsMessage.generateMessage('Admin', 'New user joined'));

    // New message created
    socket.on('createMessage', (message) => {
        io.emit('newMessage', utilsMessage.generateMessage(message.from, message.text));
    });

    // New location message
    socket.on('createLocationMessage', (message) => {
        io.emit('newLocationMessage', utilsMessage.generateLocationMessage(message.from, message.coords));
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});