const express = require('express');
const Posts = require('../schemas/posts');

const router = express.Router();
// 게시글 조회
router.get('/', async (req, res) => {
  const data = await Posts.find();
  const result = data.map((row) => {
    const postData = {
      postid: row.id,
      user: row.user,
      title: row.title,
      createdAt: row.createdAt,
    };
    return postData;
  });
  res.status(200).json({ data: result });
});

// 게시글 상세 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const existsPosts = await Posts.find({ _id: postId });
    const result = existsPosts.map((row) => {
      const postData = {
        postId: row.id,
        user: row.user,
        title: row.title,
        content: row.content,
        createdAt: row.createdAt,
      };
      return postData;
    });
    if (existsPosts.length) {
      res.status(200).json({ data: result });
    }
  } catch {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

// 게시글 작성
router.post('/', async (req, res) => {
  const {
    user, password, title, content,
  } = req.body;

  if (!(user && password && title && content)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  await Posts.create({
    user, password, title, content,
  });

  res.status(201).json({ message: '게시글을 생성하였습니다.' });
});

// 게시글 수정
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password, title, content } = req.body;

  if (!(password && title && content)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  try {
    const existsPosts = await Posts.find({ _id: postId });
    const pswrd = existsPosts.map((pw) => pw.password);

    if (existsPosts.length && String(pswrd) === String(password)) {
      await Posts.updateOne({ _id: postId }, { $set: { title, content } });
      res.status(201).json({ message: '게시글을 수정하였습니다.' });
    }
  } catch {
    res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

// 게시글 삭제
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  try {
    const existsPosts = await Posts.find({ _id: postId });
    const pswrd = existsPosts.map((pw) => pw.password);

    if (existsPosts.length && String(pswrd) === String(password)) {
      await Posts.deleteOne({ _id: postId });
    }
    res.status(201).json({ message: '게시글을 삭제하였습니다.' });
  } catch {
    res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
  }
});

module.exports = router;
