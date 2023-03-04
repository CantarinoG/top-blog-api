var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
require('dotenv').config();

var app = express();

let corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({error: err.message});
});

module.exports = app;
