//this.passport not working why ? 
function accountController(passport){
	this.passport = passport;

	this.login_get = function(req, res){
		res.render('account/accountLogin', { message: req.flash('loginMessage') });
	};

	/*this.login_post = function(req, res){
		passport.authenticate('local-login', {
			successRedirect : '/account/manage',
			failureRedirect : '/login',
			failureFlash : true //allow flash message 
		});
	};*/

	this.register_get = function(req, res){
		res.render('account/accountRegister', { message: req.flash('signupMessage') });
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
		res.render('account/accountManagement', {data : null});
	};

	this.manage_post = function(req, res){
		res.redirect('/account/management', { data : null });
	};
}
//all post method are directly inside the router 

module.exports = function(passport){
	return new accountController(passport);
}




