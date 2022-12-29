const express = require('express');
const Posts = require('../schemas/posts');

const router = express.Router();
// 게시글 조회
router.get('/', async (req, res) => {
  const data = await Posts.find().sort({ createdAt: -1 });
  const result = data.map((row) => ({
    postId: row.id,
    user: row.user,
    title: row.title,
    createdAt: new Date(row.createdAt).toLocaleString('ko'),
  }));

  res.status(200).json({ data: result });
});

// 게시글 상세 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  const regExp = /[A-z]/;

  if (regExp.test(postId)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  const existsPosts = await Posts.find({ _id: postId });
  const result = existsPosts.map((row) => ({
    postId: row.id,
    user: row.user,
    title: row.title,
    content: row.content,
    createdAt: new Date(row.createdAt).toLocaleString('ko'),
  }));

  if (!existsPosts.length) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }
  res.status(200).json({ data: result });
});

// 게시글 작성
router.post('/', async (req, res) => {
  const {
    user, password, title, content,
  } = req.body;

  const now = new Date();
  const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const createdAt = new Date(utcNow + koreaTimeDiff);

  if (!(user && password && title && content)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  await Posts.create({
    user, password, title, content, createdAt,
  });

  res.status(201).json({ message: '게시글을 생성하였습니다.' });
});

// 게시글 수정
router.put('/:postId', async (req, res) => {
  const { postId } = req.params; // 문자열 있으면 예외처리
  const regExp = /[A-z]/;

  if (regExp.test(postId)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  const { password, title, content } = req.body;
  const existsPosts = await Posts.find({ _id: postId });
  const pswrd = existsPosts.map((pw) => pw.password);

  if (!(password && title && content)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  if (!existsPosts.length) {
    res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    return;
  }

  if (String(pswrd) !== String(password)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  if (String(pswrd) === String(password)) {
    await Posts.updateOne({ _id: postId }, { $set: { title, content } });
    res.status(201).json({ message: '게시글을 수정하였습니다.' });
  }
});

// 게시글 삭제
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;

  const regExp = /[A-z]/;

  if (regExp.test(postId)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  const { password } = req.body;
  const existsPosts = await Posts.find({ _id: postId });
  const pswrd = existsPosts.map((pw) => pw.password);

  if (!password) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  if (existsPosts.length === 0) {
    res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    return;
  }

  if (String(pswrd) !== String(password)) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  if (String(pswrd) === String(password)) {
    await Posts.deleteOne({ _id: postId });
    res.status(201).json({ message: '게시글을 삭제하였습니다.' });
  }
});

module.exports = router;
