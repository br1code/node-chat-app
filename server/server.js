"use strict";
const express           = require('express');
const socketIO          = require('socket.io');
const path              = require('path');
const http              = require('http');
const utilsMessage      = require('./utils/message');
const utilsValidation   = require('./utils/validation');
const Users             = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        // if a user has been removed
        if (user) {
            // update the user list from the client
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            // send a message to the users in that room
            io.to(user.room).emit('newMessage', utilsMessage.generateMessage('Admin', user.name + ' has left.'));
        }
    });

    // New user has joined
    socket.on('join', (params, callback) => {

        // simple form validation
        if (!utilsValidation.isString(params.name) || !utilsValidation.isString(params.room)) {
            return callback('User name and room name are required');
        }

        // Join a specific room
        socket.join(params.room);

        // Add the user using the socket id and the data from the query string
        users.addUser(socket.id, params.name, params.room);

        // Emit the event to update the user list of that particular room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // Welcome message
        socket.emit('newMessage', utilsMessage.generateMessage('Admin', 'Welcome to the chat app'));

        // New user joined message
        socket.broadcast.to(params.room).emit('newMessage', utilsMessage.generateMessage('Admin', `${params.name} has joined`));

        // no error
        callback(null);
    });

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