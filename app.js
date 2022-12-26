const express = require('express');
const indexRouter = require('./routes/index');
const connect = require('./schemas');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', indexRouter);
// app.use((err, req, res, next) => {

// });

connect();

app.get('/', (req, res) => {
  res.send('<img src="https://4.bp.blogspot.com/--VHhhdaCid8/XdnHV0PMR_I/AAAAAAAmvb0/lTwe3aZyIRwYWZ6w78VIKj78oMbBkxXXgCLcBGAsYHQ/s1600/AW4084199_02.gif">');
});

app.listen(port, () => {
});
