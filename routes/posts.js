const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/posts', postController.get_posts)
router.get('/sources', postController.get_sources)

module.exports = router;
