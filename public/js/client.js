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

// SOCKET EVENTS
socket.on('newMessage', function(message) {
    // set formatted time with moment
    var time = moment(message.createdAt).format('h:mm a');
    // get mustache template
    var template = $('#message-template').html();
    // create the render
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: time
    });
    // append to the list of messages
    messagesList.append(html);
});

socket.on('newLocationMessage', function(message) {
    // set formatted time with moment
    var time = moment(message.createdAt).format('h:mm a');
    // get mustache template
    var template = $('#location-message-template').html();
    // create the render
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: time
    });
    // append to the list of messages
    messagesList.append(html);
});

// DOM EVENTS
messageForm.on('submit', function(e) {
    e.preventDefault();
    // get the input from the form and reset
    let textMessage = this.message;
    // send the message to the server
    socket.emit('createMessage', {
        from: 'User ' + socket.id.slice(0,5),
        text: textMessage.value
    });
    textMessage.value = "";
});

locationButton.on('click', function(e) {
    // if the browser dont support geolocation, alert
    if (!('geolocation' in navigator)) {
        return alert('Geolocation not supported by your browser');
    }
    // disable send location button and set loading text
    locationButton.prop('disabled', true);
    locationButton.text('Geolocating ...');
    // get geolocation and create location message
    navigator.geolocation.getCurrentPosition(function(pos) {
        socket.emit('createLocationMessage', {
            from: 'User ' + socket.id.slice(0,5),
            coords: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            } 
        });
        // enable send location button and set original text
        locationButton.prop('disabled', false);
        locationButton.text('Send Location');
    }, function(err) {
        alert('Unable to get the current geolocation');
    });
});