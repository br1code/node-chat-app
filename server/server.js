"use strict";
const express           = require('express');
const socketIO          = require('socket.io');
const path              = require('path');
const http              = require('http');
const {generateMessage} = require('./utils/message');

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
    socket.emit('newMessage', generateMessage('Chat App', 'Welcome to the chat app'));

    // New user joined message
    socket.broadcast.emit('newMessage', generateMessage('Chat App', 'New user joined'));

    // Message created broadcast
    socket.on('createMessage', (message, callback) => {
        message.createdAt = new Date();
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('The message was sent successfully');
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});