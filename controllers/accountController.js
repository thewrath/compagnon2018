//this.passport not working why ? 
function accountController(passport){
	this.passport = passport;

	this.login_get = function(req, res){
		res.render('account/accountLogin', { connected : req.isAuthenticated(), message: req.flash('loginMessage') });
	};

	/*this.login_post = function(req, res){
		passport.authenticate('local-login', {
			successRedirect : '/account/manage',
			failureRedirect : '/login',
			failureFlash : true //allow flash message 
		});
	};*/

	this.register_get = function(req, res){
		res.render('account/accountRegister', { connected : req.isAuthenticated(), message: req.flash('signupMessage') });
	};

	/*this.register_post = function(req, res){
		console.log("register post is called");
		this.passport.authenticate('local-signup', {
			successRedirect : '/account/management',
			failureRedirect : '/account/signup',
			failureFlash : true //allow flash message 
		});
	};*/

	this.manage_get = function(req, res){
		var user = req.user;
		//remove password sensible and generate avatar path 
		user.password = "";
		user.avatarPath = req.protocol+"://"+req.hostname+":3000/images/users/"+user.userPath+"/avatar.png"; 
		res.render('account/accountManagement', {connected : req.isAuthenticated(), user : user});
	};

	this.manage_post = function(req, res){
		res.redirect('/account/management', {connected : req.isAuthenticated()});
	};

	this.logout_get = function(req, res){
		req.logOut();
		res.redirect('/discover');
	}
}
//all post method are directly inside the router 

module.exports = function(passport){
	return new accountController(passport);
}; 




