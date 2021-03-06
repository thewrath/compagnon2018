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
            var generateHash = function(password) {
 
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
 
            };
            var generateAvatar = function(email, path) {
            	//create users directory 
            	var fs = require('fs');
            	var userDir = require('path').join(process.env.PWD, '/public/images/users/'+path);; 
            	
            	if(!fs.existsSync(userDir)){
            		fs.mkdirSync(userDir);
            	}

				var identicon = require('identicon'); 
				identicon.generate({ id : email, size : 400}, function(err, buffer){
					if(err) throw err; 
					fs.writeFileSync(require('path').join(process.env.PWD, '/public/images/users/'+path+'/avatar'+'.png'), buffer); 
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
	 					User.findOne({
	 						where: {
	 							username: req.body.username
	 						}
	 					}).then(function(user){

	 						if(user){
	 							return done(null, false, req.flash('signupMessage', 'Ce nom est deja utilise '));
	 						}
	 						else{
	 							var path = generateHash(email)
	 							var userPassword = generateHash(password);
			                    var data =
			 
			                        {
			                            email: email,
			 
			                            password: userPassword,
			 
			                            username: req.body.username,

			                            userPath : path,
			 
			                        };
			 
			                    User.create(data).then(function(newUser, created) {
			 
			                        if (!newUser) {
			 
			                            return done(null, false);
			 
			                        }
			 
			                        if (newUser) {
			 							generateAvatar(email,path);
			                            return done(null, newUser);
			 
			                        }
			 
			                    });
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
	                message: "Oups quelque chose c'est mal passe..."
	            });
	 
	        });
 		});
 
    }
 
));
};