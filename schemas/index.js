const mongoose = require('mongoose');

const connect = () => {
  mongoose
    // 로컬
    // .connect('mongodb://sjw:sjw@3.38.99.102:27017/admin', {
    .connect('mongodb://sjw:sjw@127.0.0.1:27017/admin', {
      dbName: 'node_blog',
      ignoreUndefined: true,
    })
    .catch((error) => {
      console.error(error);
    });
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
