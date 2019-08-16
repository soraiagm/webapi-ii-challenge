const express = require('express');

const posts = require('./data/seeds/01-posts.js');

const server = express();

server.use(express.json());

// REQUEST HANDLER

server.post('/posts', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    } else {
        posts.insert(req.body)
            .then(post => {
                res.status(201).json(post);
        })
            .catch(() => {
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
            });
        });
    }
});

server.post('/api/posts/:id/comments:', (req, res) => {
    posts.findById(req.params.id)
    .then(posts => {
        res.status(404).json(
            { message: "The post with the specified ID does not exist." });
        })    
        const { text } = req.body;

        if (!text) {
            res.status(400).json(
                { errorMessage: "Please provide text for the comment." 
            });
        } else {
            posts.insertComment(req.body)
                .then(comment => {
                    res.status(201).json(comment);
                })
                .catch(() => {
                    res.status(500).json(
                        { error: "There was an error while saving the comment to the database"});
                });
            }
    });
   

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Posts API</h2>`);
});

server.get('/api/posts', (req, res) => {
    posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json(
          { error: "The posts information could not be retrieved." }
          );
      });
  });

  server.get('/api/posts/:id', (req, res) => {
        posts.findById(req.params.id)
            .then(post => {
                if (post) {
                    res.status(200).json(post);
                } else {
                    res.status(404).json(
                        { message: "The post with the specified ID does not exist." });
                    }
                })
            .catch(() => {
                res.status(500).json(
                    { error: "The post information could not be retrieved." }
            );
        });
    });

    server.get('/api/posts/:id/comments:', (req, res) => {
        posts.findPostComments(req.params.postId) 
            .then(post => {
                res.status(404).json(
                    { message: 'The post with the specified ID does not exist.' });
                })
            .catch(() => {
                res.status(500).json(
                    { error: "The comments information could not be retrieved." });
            });
    });

    server.delete('/api/posts/:id', (req, res) => {
        posts.remove(req.params.id)
            .then(count => {
                if(count && count > 0) {
                    res.status(200).json(
                        { message: 'The post was deleted' });
                } else {
                    res.status(404).json(
                        { message: "The post with the specified ID does not exist." });
                } 
            })
            .catch(() => {
                res.status(500).json(
                    { errorMessage: 'The post could not be removed' })
            });
    });

    server.put('/posts/:id', (req, res) => {
        posts.update(req.params.id)
            .then(updated => {
                res.status(404).json(
                    { message: "The post with the specified ID does not exist" });
            })
            if (!title || !contents ) {
                res.status(400).json(
                    { errorMessage: "Please provide title and contents for the post." });
            } else {
                posts.update(req.body)
                    .then(updated => {
                            res.status(201).json(updated);
                    })
                    .catch(() => {
                        res.status(500).json(
                            { error: "The post information could not be modified." });
                    });
            }
    });

module.exports = server;

