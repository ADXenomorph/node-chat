'use strict';

function Messages() {
    let messages = [];

    this.getMessages = () => messages;

    this.sendMessage = (name, text) => {
        const newMessage = {
            name: name,
            message: text,
            timestamp: (Math.floor(Date.now() / 1000))
        };
        messages.push(newMessage);
        return newMessage;
    };
}

module.exports = new Messages();
