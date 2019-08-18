const express = require('express');

const postsRouter = require('./data/seeds/posts-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter);

// REQUEST HANDLER

server.get('/', (req, res) => {
    console.log(req.body);
    res.send(`
    <h2>Lambda Posts API</h2>`);
});

module.exports = server;

