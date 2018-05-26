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
    socket.emit('newMessage', utilsMessage.generateMessage('Chat App', 'Welcome to the chat app'));

    // New user joined message
    socket.broadcast.emit('newMessage', utilsMessage.generateMessage('Chat App', 'New user joined'));

    // Message created broadcast
    socket.on('createMessage', (message, callback) => {
        message.createdAt = new Date();
        io.emit('newMessage', utilsMessage.generateMessage(message.from, message.text));
        callback();
    });

    // Location message
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', utilsMessage.generateLocationMessage('User', coords));
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});