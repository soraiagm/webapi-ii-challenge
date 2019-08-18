const express = require('express');

const posts = require('../db.js');

const router = express.Router();
// URI: /api/posts



router.get('/', (req, res) => {
    posts.find(req.query)
        .then(posts => {
        res.status(200).json(posts);
})
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "The posts information could not be retrieved." });
  });
});

router.get('/:id', (req, res) => {
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

// router.get('/:id/comments', (req, res) => {
//     posts.findPostComments(req.params.id) 
//         .then(post => {
//             res.status(404).json(
//                 { message: 'The post with the specified ID does not exist.' });
//             })
//         .catch(() => {
//             res.status(500).json(
//                 { error: "The comments information could not be retrieved." });
//         });
// });

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await posts.findPostComments(id);
        res.status(200).json(comments);
    }   catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'The post with the specified ID does not exist',
        })
    }   
});

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.post('/', (req, res) => {
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

// router.post('/:id/comments:', (req, res) => {
//     posts.findById(req.params.id)
//     .then(posts => {
//         res.status(404).json(
//             { message: "The post with the specified ID does not exist." });
//         })    
//         const { text } = req.body;

//         if (!text) {
//             res.status(400).json(
//                 { errorMessage: "Please provide text for the comment." 
//             });
//         } else {
//             posts.insertComment(req.body)
//                 .then(comment => {
//                     res.status(201).json(comment);
//                 })
//                 .catch(() => {
//                     res.status(500).json(
//                         { error: "There was an error while saving the comment to the database"});
//                 });
//             }
//     });

router.post('/:id/comments', async (req, res) => {
    const commentInfo = {...req.body, post_id: req.params.id };

    try {
      const savedComment = await posts.insertComment(commentInfo)
      res.status(201).json(savedComment);
    } catch  (error) {
      console.log(error);
      res.status(500).json({
          error: "There was an error while saving the comment to the database"
      });
    }
})

    module.exports = router;