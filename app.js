const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const mainRouter = require('./routes/main');
const adminLoginRouter = require('./routes/admin');

const app = express();

// view engine setup	
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images', express.static(path.join(__dirname + '/images')));
// app.use(express.static('public/images'));

app.use(bodyParser.urlencoded({
	extended: true
}));

// let options = {
// 	host: "us-cdbr-iron-east-03.cleardb.net",
//   	user: "b137b481565ba4",
//   	password: "3d0e4252",
//   	database: "heroku_656924a3d6f9fc3"
// };
// var sessionStore = new MySQLStore(options);

app.use('/main', mainRouter);
app.use('/admin', adminLoginRouter);
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

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
