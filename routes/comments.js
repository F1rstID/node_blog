const express = require('express');
const Comments = require('../schemas/comments');

const router = express.Router();

router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const {
    user, password, content,
  } = req.body;

  const createComments = await Comments.create({
    postId, user, password, content,
  });

  return res.json({ result: 'success', comments: createComments });
});

// 댓글 목록 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const data = await Comments.find({ postId });
  const result = data.map((v) => {
    const commentData = {
      commentId: v.id, // _id로 받아오면 ObjectId 이고 id로 받아오면 String 왜지.
      user: v.user,
      content: v.content,
      createAt: v.createAt,
    };
    return commentData;
  });
  res.json({ data: result });
});

router.put('/:commentsId', async (req, res) => {
  const { commentsId } = req.params;

  const existsComments = await Comments.find({ _id: commentsId });
  const pswrd = existsComments.map((v) => v.password);
  const { password, content } = req.body;

  if (existsComments.length && Number(pswrd) === Number(password)) {
    await Comments.updateOne({ _id: commentsId }, { $set: { content } });
  }
  res.send('');
});

router.delete('/:commentsId', async (req, res) => {
  const { commentsId } = req.params;
  const { password } = req.body;

  const existsComments = await Comments.find({ _id: commentsId });
  const pswrd = existsComments.map((pw) => pw.password);

  if (existsComments.length && Number(pswrd) === Number(password)) {
    await Comments.deleteOne({ _id: commentsId });
  }
  res.send('');
});

module.exports = router;
