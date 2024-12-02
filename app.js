var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require ('./model/userModel');
require('./model/commentModel');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var studentsRouter = require('./routes/student');
var uploadRouter = require('./routes/upload');
var email = require('./routes/mail');
var users = require('./routes/users');
var student = require('./routes/student');
var comment = require('./routes/comment');


var app = express();

mongoose.connect('mongodb+srv://aikido2142005:O2CQLRIhMncKxPud@cluster0.wa5ij.mongodb.net/mb103')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', users);
app.use('/student', student);
app.use('/upload', uploadRouter);
app.use('/email', email);
app.use('/comment',comment);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
