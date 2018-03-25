//Contient la liste des routes relativent à message 
module.exports = function(router, passport, message, isLoggedIn, sequelize){ 
	//Require controller modules 
	var message_controller = require('../controllers/messageController')(message);
	var prefix = '/message';
	/// BOOK ROUTES /// 

	// GET home page 
	router.get(prefix+'/', isLoggedIn, message_controller.index);
	router.post(prefix+'/send', isLoggedIn, message_controller.message_post);

}