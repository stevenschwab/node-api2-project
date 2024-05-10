const express = require('express')
const Posts = require('./posts-model')

const router = express.Router()

// posts endpoints
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                error: err.message
            })
        })
});

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be retrieved",
                error: err.message
            })
        })
});

router.post('/', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) {
        return res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }

    Posts.insert({ title, contents })
        .then(post => {
            return Posts.findById(post.id)
        })
        .then(newPost => {
            if (newPost) {
                res.status(201).json(newPost)
            } else {
                res.status(404).json({
                    message: "The newly created post could not be found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "There was an error while saving the post to the database",
                error: err.message
            })
        })
});

router.put('/:id', (req, res) => {
    const { title, contents } = req.body;
    const { id } = req.params;

    if (!title || !contents) {
        return res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }
    
    Posts.update(id, { title, contents })
        .then(count => {
            if (count) {
                return Posts.findById(id)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                });
                return;
            }
        })
        .then(updatedPost => {
            if (updatedPost) {
                res.json(updatedPost)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be modified",
                error: err.message
            })
        })
})

module.exports = router