const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
	windowMs: 1000 * 60,
	max: 1,
	delayMs: 0,
	skipFailedRequests: true,
});

const routes = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.post('/api/validate-email', rateLimiter, routes.emails.validateEmailSync);
app.post('/api/validate-email-async', rateLimiter, routes.emails.validateEmailAsync);
app.get('/api/validate-email', routes.emails.validateEmail);
app.get('/', routes.root);

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
