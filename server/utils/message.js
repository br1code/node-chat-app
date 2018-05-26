function generateMessage(from, text) {
    let message = {
        from,
        text,
        createdAt: new Date()
    }
    return message;
}

function generateLocationMessage(from, coords) {
    return {
        from,
        url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt: new Date()
    };
}

module.exports = {
    generateMessage,
    generateLocationMessage
};