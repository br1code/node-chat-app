"use strict";
var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    // create a new li with the message data
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    // append to the DOM
    $('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    // get the text from the input
    let textMessage = this.message.value;
    // send the message to the server
    socket.emit('createMessage', {
        from: 'User',
        text: textMessage
    }, function(data) {
        console.log(data);
    });
});