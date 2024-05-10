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
                message: "The posts information could not be retrieved"
            })
        })
})

module.exports = router