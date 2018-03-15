var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var sequelize = require('sequelize');

var config = require('./config/config');
var dbConfig  = require('./config/database');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//required for passport and session 
app.use(session({ secret: 'pagnoncompa2018snirprojet' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

//db connection with sequelize
const sequelizeInst = new sequelize(dbConfig.uri);

sequelizeInst
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//allow sequelize to create table inside the DB 
sequelizeInst.sync();
//routes 
require('./routes/index')(app, passport, sequelizeInst);
require('./routes/users')(app, passport, sequelizeInst);
require('./routes/message')(app, passport, sequelizeInst); 
require('./routes/account')(app, passport, sequelizeInst);
require('./routes/map')(app, passport, sequelizeInst);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


app.listen(config.port);
console.log("listen on port "+ config.port);