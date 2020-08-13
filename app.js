const express = require('express');
const taxiRouter = require('./routes/taxi.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', taxiRouter);

/* eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  let errorMsg;
  if (typeof err === 'string') {
    errorMsg = err;
  } else {
    errorMsg = err.message;
  }
  res.status(err.status || 400);

  res.send({ error: errorMsg });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

module.exports = app;
