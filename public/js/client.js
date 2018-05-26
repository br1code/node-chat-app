"use strict";
var messagesList = $('#messages');
var messageForm = $('#message-form');
var locationButton = $('#send-location');

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
    messagesList.append(li);
});

socket.on('newLocationMessage', function(message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    messagesList.append(li);
});

messageForm.on('submit', function(e) {
    e.preventDefault();
    // get the text from the input
    let textMessage = this.message.value;
    this.message.value = "";
    // send the message to the server
    socket.emit('createMessage', {
        from: 'User',
        text: textMessage
    }, function(data) {
        console.log(data);
    });
});

locationButton.on('click', function(e) {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
        socket.emit('createLocationMessage', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        });
    }, function(err) {
        alert('Unable to get the current geolocation');
    });
});