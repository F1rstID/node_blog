const express = require('express');
const Posts = require('../schemas/posts');

const router = express.Router();

router.get('/posts', (req, res) => {
  const posts = Posts.find({});
  res.json({ data: posts });
});

router.post('/posts', async (req, res) => {
  const {
    user, password, title, content,
  } = req.body;

  // const posts = await Posts.find

  const createPosts = await Posts.create({
    user, password, title, content,
  });

  return res.json({ result: 'success', posts: createPosts });
});

module.exports = router;
