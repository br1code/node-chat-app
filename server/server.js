"use strict";
const express                   = require('express');
const socketIO                  = require('socket.io');
const path                      = require('path');
const http                      = require('http');
const validation                = require('./utils/validation');
const Users                     = require('./utils/users');
const generateMessage           = require('./utils/message').generateMessage;
const generateLocationMessage   = require('./utils/message').generateLocationMessage;

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // User has left
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        // if a user has been removed
        if (user) {
            // update the user list from the client
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            // send a message to the users in that room
            io.to(user.room).emit('newMessage', generateMessage('Admin', user.name + ' has left.'));
        }
    });

    // New user has joined
    socket.on('join', (params, callback) => {

        // simple form validation
        if (!validation.isRealString(params.name) || !validation.isRealString(params.room)) {
            return callback('User name and room name are required');
        }

        // Join a specific room
        socket.join(params.room);

        // Add the user using the socket id and the data from the query string
        users.addUser(socket.id, params.name, params.room);

        // Emit the event to update the user list of that particular room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // Send a welcome message
        socket.emit('newMessage', generateMessage('Admin', `Welcome to "${params.room}" room`));

        // Notify other users that a user has joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        // no error
        callback(null);
    });

    // New message created
    socket.on('createMessage', (message) => {
        // get the user with the socket id
        let user = users.getUser(socket.id);
        // if the user has been found and the text it's not empty
        if (user && validation.isRealString(message.text)) {
            // send a new message only to that particular room
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
    });

    // New location message
    socket.on('createLocationMessage', (message) => {
        // get the user with the socket id
        let user = users.getUser(socket.id);
        // if the user has been found
        if (user) {
            // send a new location message only to that particular room
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, message.coords));
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});