const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Bruno';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'Bruno';
        var latitude = 15;
        var longitude = 10;
        var url = 'https://www.google.com/maps?q=15,10';
        var message = generateLocationMessage(from, {latitude, longitude});

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});