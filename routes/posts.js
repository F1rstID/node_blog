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

  if (postId === undefined || postId === null || postId === '') {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

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
  const pswrd = existsPosts.map((pw) => pw.password);

  const { password, title, content } = req.body;

  if (existsPosts.length && Number(pswrd) === Number(password)) {
    await Posts.updateOne({ _id: postId }, { $set: { title, content } });
    res.send('');
  }
  // return res.send('얍');
});

// 게시글 삭제
router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  const existsPosts = await Posts.find({ _id: postId });
  const pswrd = existsPosts.map((pw) => pw.password);

  if (existsPosts.length && Number(pswrd) === Number(password)) {
    await Posts.deleteOne({ _id: postId });
  }

  res.send('');
});

module.exports = router;
