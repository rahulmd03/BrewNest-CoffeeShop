var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var exphbs = require('express-handlebars')
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var app = express();
var fileUpload = require('express-fileupload');
var db = require('./config/connection');
var session = require('express-session')


// view engine setup
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layout'),
  partialsDir: path.join(__dirname, 'views/partials'),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    addOne: function (value) {
      return value + 1;
    },
    multiply: function (a, b) {
      return a * b;
    }
  }

}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
  secret:"Key",
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:600000}
}));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


db.connect((err) => {
  if (err) {
    console.log('Connection Error' + err);
  } else {
    console.log("Database connected to port 27017")
  }
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

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
