//Contient la liste des routes relativent à message 
module.exports = function(router, passport, isLoggedIn, isNotLoggedIn,sequelize){ 
	//Require controller modules 
	var account_controller = require('../controllers/accountController')(passport);
	var prefix = '/account';
	/// BOOK ROUTES ///
	// GET management page 
	router.get(prefix+'/manage', isLoggedIn,account_controller.manage_get);
	// POST update management page 
	router.post(prefix+'/manage', isLoggedIn, account_controller.manage_post);
	// GET login  
	router.get(prefix+'/login', isNotLoggedIn,account_controller.login_get);
	// POST login 
	router.post(prefix+'/login', isNotLoggedIn,passport.authenticate('local-signin', {
		successRedirect: '/account/manage', 
		failureRedirect: '/account/login', 
		failureFlash: true 
	}));
	// GET register page 
	router.get(prefix+'/register', isNotLoggedIn,account_controller.register_get);
	// POST new registration request
	router.post(prefix+'/register', isNotLoggedIn,passport.authenticate('local-signup', {
		successRedirect: '/account/manage', 
		failureRedirect: '/account/register', 
		failureFlash: true 
	}));

};