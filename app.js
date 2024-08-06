var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//config moogese
const mongoose = require('mongoose');
require('./models/category');
require('./models/product');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sinhvienRouter = require('./routes/sinhvien');
var categoryRouter = require('./routes/categoryRouter');
var productRouter = require('./routes/produtctRouter');

var app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-config.js');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect database
mongoose.connect('mongodb://127.0.0.1:27017/NodeJS')
  .then(() => console.log('Kết nối tới DBMongo thành công'))
  .catch(err => console.log('Kết nối thất bại: ', err));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sinhvien', sinhvienRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);

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
