//load bcrypt
var bCrypt = require('bcrypt-nodejs');

 
module.exports = function(passport, sequelize) {
 
 
    const User = sequelize.import("../models/userModel"); 
 
    var LocalStrategy = require('passport-local').Strategy;
 	
 	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});
 	
    passport.use('local-signup', new LocalStrategy(
 
        {
 
            usernameField: 'email',
 
            passwordField: 'password',
 
            passReqToCallback: true // allows us to pass back the entire request to the callback
 
        },
 
 
 
        function(req, email, password, done) {
 			console.log("function for the local signup is called");
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
 
            };
            var generateAvatar = function(email) {
            	//create users directory 
            	var fs = require('fs');
            	var userDir = require('path').join(process.env.PWD, '/public/images/users/'+email); 
            	
            	if(!fs.existsSync(userDir)){
            		fs.mkdirSync(userDir);
            	}

				var identicon = require('identicon'); 
				identicon.generate({ id : email, size : 400}, function(err, buffer){
					if(err) throw err; 
					fs.writeFileSync(require('path').join(process.env.PWD, '/public/images/users/'+email+'/avatar'+'.png'), buffer); 
				});
 			}
 
 			process.nextTick(function() {
	            User.findOne({
	                where: {
	                    email: email
	                }
	            }).then(function(user) {
	 
	                if (user)
	 
	                {
	 
	                    return done(null, false, req.flash('signupMessage', 'Cet Email est deja utilise.'));
	 
	                } else
	 
	                {
	 					
	                    var userPassword = generateHash(password);
	 
	                    var data =
	 
	                        {
	                            email: email,
	 
	                            password: userPassword,
	 
	                            firstname: req.body.firstname,
	 
	                            lastname: req.body.lastname
	 
	                        };
	 
	                    User.create(data).then(function(newUser, created) {
	 
	                        if (!newUser) {
	 
	                            return done(null, false);
	 
	                        }
	 
	                        if (newUser) {
	 							generateAvatar(email);
	                            return done(null, newUser);
	 
	                        }
	 
	                    });
	 
	                }
	 
	            });
 			});	
        }
 
    ));
    passport.use('local-signin', new LocalStrategy(
 
    {
 
        // by default, local strategy uses username and password, we will override with email
 
        usernameField: 'email',
 
        passwordField: 'password',
 
        passReqToCallback: true // allows us to pass back the entire request to the callback
 
    },
 
 
    function(req, email, password, done) {
 
        var isValidPassword = function(userpass, password) {
 
            return bCrypt.compareSync(password, userpass);
 
        }
 		process.nextTick(function() {
	        User.findOne({
	            where: {
	                email: email
	            }
	        }).then(function(user) {
	 
	            if (!user) {
	 
	                return done(null, false, req.flash('loginMessage', 'Email incorrecte.'));
	 
	            }
	 
	            if (!isValidPassword(user.password, password)) {
	 
	                return done(null, false, req.flash('loginMessage', 'Le mot de passe est incorrecte.'));
	 
	            }
	 
	 
	            var userinfo = user.get();
	            return done(null, userinfo);
	 
	 
	        }).catch(function(err) {
	 
	            console.log("Error:", err);
	 
	            return done(null, false, {
	                message: 'Something went wrong with your Signin'
	            });
	 
	        });
 		});
 
    }
 
));
};