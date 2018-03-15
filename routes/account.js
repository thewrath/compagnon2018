//Contient la liste des routes relativent à message 
module.exports = function(router, passport, sequelize){ 
	//Require controller modules 
	var account_controller = require('../controllers/accountController');
	var prefix = '/account';
	/// BOOK ROUTES ///
	// GET management page 
	router.get(prefix+'/manage', account_controller.manage_get);
	// POST update management page 
	router.post(prefix+'/manage', account_controller.manage_post);
	// GET login  
	router.get(prefix+'/login', account_controller.login_get);
	// POST login 
	router.post(prefix+'/login', account_controller.login_post)
	// GET register page 
	router.get(prefix+'/register', account_controller.register_get);
	// POST new registration request
	router.post(prefix+'/register', account_controller.register_post);

}