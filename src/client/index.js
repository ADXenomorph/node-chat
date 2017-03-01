'use strict';

let chat = null;
document.addEventListener("DOMContentLoaded", () => {
    chat = new Chat();
    chat.run(document.getElementById('main'));
});

function Chat() {
    let mainNode = null;
    let usersOnline = [];
    let socket = null;

    this.run = (node) => {
        mainNode = node;
        renderLogin();
    };

    this.login = (button) => {
        let name = button.parentElement.children["name"].value;
        if (!name) {
            return alert('Please specify some name');
        }
        initSocket(name);
    };

    this.sendMessage = (message) => {
        if (!message) {
            return
        }

        socket.emit('sendMessage', message);
    };

    function initSocket(name) {
        socket = io('http://localhost:5000?name=' + name);
        socket.on('connectionSuccess', () => {
            usersOnline = [];
            renderChat(name);
            socket.on('messages', loadMessages);
            socket.on('users', loadUsers);
            socket.on('newMessage', newMessageHandler);
        });
        socket.on('connectionError', () => {
            alert('Username is already taken. Please choose another one');
        });
    }

    function renderLogin() {
        mainNode.innerHTML = `
            <div>
                <label>Name:</label>
                <input type="text" name="name">
                <input type="button" value="Login" onclick="chat.login(this)">
            </div>
        `;
    }

    function renderChat() {
        mainNode.innerHTML = `
            <div class="column">
                <div class="messageInput">
                    <textarea name="message" placeholder="Use Ctrl-Enter or ⌘-Enter to send"></textarea>
                </div>
                <div class="messagesBox"><ul class="messagesList"></ul></div>
            </div>
            <div class="usersBox">Online: <ul class="usersList"></ul></div>
        `;

        const textarea = mainNode.querySelectorAll('textarea[name=message]')[0];
        textarea.addEventListener(
            'keyup',
            (event) => {
                event.preventDefault();
                if (event.keyCode == 13 && (event.ctrlKey || event.metaKey)) {
                    chat.sendMessage(event.target.value);
                    event.target.value = '';
                }
            }
        );
    }

    function getMessagesListNode() {
        return mainNode.querySelectorAll('.messagesList')[0];
    }

    function getMessageView(msg) {
        const text = msg.message.replace(/(?:\r\n|\r|\n)/g, '<br />');;
        return `<span class="messageUserName">${msg.name}</span><span class="messageText">${text}</span>`;
    }

    function loadMessages(messages) {
        getMessagesListNode().innerHTML = messages
            .sort((msg1, msg2) => {
                if (msg1.timestamp > msg2.timestamp) {
                    return -1;
                }
                if (msg1.timestamp < msg2.timestamp) {
                    return 1;
                }

                return 0;
            })
            .map((msg) => '<li class="messageLine">' + getMessageView(msg) + '</li>')
            .join('');
    }

    function getUsersListNode() {
        return mainNode.querySelectorAll('.usersList')[0];

    }

    function loadUsers(users) {
        getUsersListNode().innerHTML = users
            .sort()
            .map((user) => '<li>' + user + '</li>')
            .join('');
    }

    function newMessageHandler(message) {
        const msgList = getMessagesListNode();
        const listItem = document.createElement('li');
        listItem.className = 'messageLine';
        listItem.innerHTML = getMessageView(message);
        msgList.insertBefore(listItem, msgList.firstChild);
    }
}
