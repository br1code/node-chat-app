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
    // ser formatted time with moment
    var time = moment(message.createdAt).format('h:mm a');
    // create a new li with the message data
    var li = $('<li></li>');
    // set formatted li text
    var text = message.from + ' ' + time + ': ' + message.text;
    li.text(text);
    // append to the list of messages
    messagesList.append(li);
});

socket.on('newLocationMessage', function(message) {
    // create new li and a tag
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    // set li text
    li.text(`${message.from}: `);
    // set href to a tag
    a.prop('href', message.url);
    // append the a tag to the li
    li.append(a);
    // append to the list of messages
    messagesList.append(li);
});

messageForm.on('submit', function(e) {
    e.preventDefault();
    // get the input from the form
    let textMessage = this.message;
    // send the message to the server
    socket.emit('createMessage', {
        from: 'User',
        text: textMessage.value
    }, function() {
        textMessage.value = "";
    });
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
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        });
        // enable send location button and set original text
        locationButton.prop('disabled', false);
        locationButton.text('Send Location');
    }, function(err) {
        alert('Unable to get the current geolocation');
    });
});