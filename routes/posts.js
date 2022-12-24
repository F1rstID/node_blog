const express = require('express');
const Posts = require('../schemas/posts');

const router = express.Router();
// 게시글 조회
router.get('/posts', async (req, res) => {
  const data = await Posts.find();
  const result = data.map((v) => {
    const postData = {
      // eslint-disable-next-line no-underscore-dangle
      postid: v._id,
      user: v.user,
      title: v.title,
      createAt: v.createAt,
    };
    return postData;
  });
  res.json({ data: result });
});

// 게시글 상세 조회
router.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const existsPosts = await Posts.find({ _id: postId });
  const result = existsPosts.map((val) => {
    const postData = {
      // eslint-disable-next-line no-underscore-dangle
      postId: val._id,
      user: val.user,
      title: val.title,
      content: val.content,
      createAt: val.createAt,
    };
    return postData;
  });

  if (existsPosts.length) {
    res.json({ data: result });
  }
});

// 게시글 작성
router.post('/posts', async (req, res) => {
  const {
    user, password, title, content,
  } = req.body;

  const createPosts = await Posts.create({
    user, password, title, content,
  });

  return res.json({ result: 'success', posts: createPosts });
});

router.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  const existsPosts = await Posts.find({ _id: postId });
  const pass = existsPosts.map((e) => e.password);

  const { password, title, content } = req.body;

  if (existsPosts.length && Number(pass) === Number(password)) {
    await Posts.updateOne({ _id: String(postId) }, { $set: { title, content } });
    res.send('');
  }
  // return res.send('얍');
});

router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const existsPosts = await Posts.find({ postId });

  if (existsPosts.length) {
    await Posts.deleteOne({ _id: postId });
  }

  res.send('');
});

module.exports = router;
