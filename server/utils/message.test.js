const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Bruno';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('object');
        expect(message).toInclude({from, text});
    });
});