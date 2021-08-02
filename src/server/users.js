'use strict';

function Users() {
    let users = [];

    this.add = (name) => {
        users.push(name);

        return users;
    };

    this.remove = (name) => {
        users.splice(users.indexOf(name), 1);

        return users;
    };

    this.exists = (name) => {
        return users.indexOf(name) !== -1;
    }
}

module.exports = new Users();
