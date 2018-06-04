"use strict";
var messagesList = $('#messages');
var messageForm = $('#message-form');
var locationButton = $('#send-location');

var socket = io();

// SOCKET EVENTS
socket.on('connect', function() {
    // get the query string params
    var queryParams = $.deparam(window.location.search);
    // send to the server for internal validation
    socket.emit('join', queryParams, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(userList) {
    // create a new list
    var ol = $('<ol></ol>');
    // append each user name to the list
    userList.forEach(function(userName) {
        ol.append($('<li></li>').text(userName));
    });
    // update the list in the DOM
    $('#users').html(ol);
})

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
    scrollToBottom();
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
    scrollToBottom();
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

// Scroll Down handling
function scrollToBottom() {
    // get the new incoming message
    var newMessage = messagesList.children('li:last-child');
    // Heights
    var clientHeight = messagesList.prop('clientHeight');
    var scrollTop = messagesList.prop('scrollTop');
    var scrollHeight = messagesList.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    // total current height
    var currentHeight = clientHeight + scrollTop + 
        newMessageHeight + lastMessageHeight;
    // calculate
    if (currentHeight >= scrollHeight) {
        messagesList.scrollTop(scrollHeight);
    }
}