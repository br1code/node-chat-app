function generateMessage(from, text) {
    let message = {
        from,
        text,
        createdAt: new Date()
    }
    return message;
}

module.exports = {
    generateMessage
};