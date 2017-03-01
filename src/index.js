'use strict';

const nodeStatic = require('node-static');
const server = require('http')
    .createServer((req, res) => {
        if (req.url.indexOf('.js') === -1
            && req.url.indexOf('.css') === -1
        ) {
            req.url = "/index.html";
        }

        new nodeStatic.Server('src/client').serve(req, res);
    })
    .listen(5000);
const io = require('socket.io')(server);

io.on('connection', require('./server/connection')(io));
