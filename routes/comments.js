const express = require('express');
const Comments = require('../schemas/comments');

const router = express.Router();

// 댓글 생성
router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const {
    user, password, content,
  } = req.body;

  const now = new Date();
  const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const createdAt = new Date(utcNow + koreaTimeDiff);

  if (!content) {
    res.json.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }

  if (!(user && password)) {
    res.json.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  await Comments.create({
    postId, user, password, content, createdAt,
  });

  res.status(201).json({ message: '댓글을 생성하였습니다.' });
});

// 댓글 목록 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const data = await Comments.find({ postId }).sort({ createdAt: -1 });
    const result = data.map((row) => {
      const commentData = {
        commentsId: row.commentsId, // _id로 받아오면 ObjectId 이고 id로 받아오면 String 왜지.
        user: row.user,
        content: row.content,
        createdAt: new Date(row.createdAt).toLocaleString('ko'),
      };
      return commentData;
    });
    res.status(200).json({ data: result });
  } catch {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
});

router.put('/:commentsId', async (req, res) => {
  const { commentsId } = req.params;
  const { password, content } = req.body;

  if (!content) {
    res.json.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }

  if (!password) {
    res.json.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  try {
    const existsComments = await Comments.find({ commentsId });
    const pswrd = existsComments.map((row) => row.password);

    if (existsComments.length && String(pswrd) === String(password)) {
      await Comments.updateOne({ commentsId }, { $set: { content } });
    }
    res.status(201).json({ message: '댓글을 수정하였습니다.' });
  } catch {
    res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
  }
});

router.delete('/:commentsId', async (req, res) => {
  const { commentsId } = req.params;
  const { password } = req.body;

  if (!password) {
    res.json.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    return;
  }

  try {
    const existsComments = await Comments.find({ commentsId });
    const pswrd = existsComments.map((pw) => pw.password);

    if (existsComments.length && String(pswrd) === String(password)) {
      await Comments.deleteOne({ commentsId });
    }
    res.status(201).json({ message: '댓글을 삭제하였습니다.' });
  } catch {
    res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
  }
});

module.exports = router;
