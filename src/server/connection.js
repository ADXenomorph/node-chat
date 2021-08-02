'use strict';

const messages = require('./messages');
const users = require('./users');

module.exports = (io) => (client) => {
    const userName = client.handshake.query.name;
    const systemName = '--------';

    if (users.exists(userName)) {
        client.emit('connectionError');
        return;
    }

    client.emit('connectionSuccess');

    sendMsg(systemName, userName + ' joined the chat');
    io.emit('users', users.add(userName));

    client.emit('messages', messages.getMessages());

    client.on('sendMessage', (message) => {
        sendMsg(userName, message);
    });

    client.on('disconnect', () => {
        sendMsg(systemName, userName + ' left the chat');
        io.emit('users', users.remove(userName));
    });

    function sendMsg(name, msg) {
        io.emit('newMessage', messages.sendMessage(name, msg));
    }
};
