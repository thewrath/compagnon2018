//import des differents modules 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var sequelize = require('sequelize');
var flash = require('connect-flash');
//import des configurations 
var config = require('./config/config');
var dbConfig  = require('./config/database');

//initialisation d'une app expressJS 
var app = express();

//initialisation du moteur de template (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var logger = function(req, res, next){
  console.log("REQUEST SEND TO SERVER");
  console.log(req.url)
  next();
};

//add loggerto handle all routes 
app.use(logger);
//initialisation des differents modules lie a express 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));

//initialisation de la session express et du gestionnaire d'utilisateur 
app.use(session({ secret: 'pagnoncompa2018snirprojet' })); 
app.use(passport.initialize());
//active le stockage des donnees de l'utilisateur dans la session 
app.use(passport.session()); 
//initialisation du module flash 
app.use(flash());
//creation d'un asservissement de ressources publique (image...)
var dir = path.join(__dirname, 'public'); 
app.use(express.static(dir));

//initialisation et configuration de sequelize 
const sequelizeInst = new sequelize(dbConfig.uri);

sequelizeInst
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//autoriser sequelize a creer des tables dans la base de donnees 
sequelizeInst.sync();
//charge la configuration du passport 
require('./config/passport')(passport, sequelizeInst);
//récupération des gestionnaire de modèles sequelize 
const message = require('./config/message')(sequelizeInst);
const user = require('./config/user')(sequelizeInst);


//fonction middleware permettant de verifier si un utilisateur est logge
var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/account/login');
};

//fonction middleware permettant de verifier si un utilisateur n'est pas logge
var isNotLoggedIn = function(req, res, next) {
  if(!req.isAuthenticated())
    return next();
  res.redirect('/account/manage');
};

//routage des differentes parties du site (avec middleware en parametre)
require('./routes/index')(app, passport, user, isLoggedIn, sequelizeInst);
require('./routes/group')(app, passport, isLoggedIn, sequelizeInst);
require('./routes/message')(app, passport, message, isLoggedIn, sequelizeInst); 
require('./routes/account')(app, passport, isLoggedIn, isNotLoggedIn, sequelizeInst);
require('./routes/map')(app, passport, isLoggedIn, sequelizeInst);


//catch de l'erreur 404 not found 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//!! a desactiver en production !!//

//handler pour differents erreurs 
app.use(function(err, req, res, next) {
  //utiliser pour le developpement 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //page d'erreur lors du developpement 
  res.status(err.status || 500);
  res.render('error');
});

//ecoute sur le port correspondant 
app.listen(config.port);
console.log("listen on port "+ config.port);