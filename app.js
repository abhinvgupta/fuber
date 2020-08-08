var express = require('express');
var taxiRouter = require('./routes/taxi.js');


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', taxiRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.status(err.status || 500);
  let errorMsg;
  if (typeof err === 'string') {
    errorMsg = err;
  } else {
    errorMsg = err.message;
  }
  res.status(400);

  res.send({ error: err.message })
});


// finally, let's start our server...
var server = app.listen( process.env.PORT || 8000, function(){
  console.log('Listening on port ' + server.address().port);
});

module.exports = app