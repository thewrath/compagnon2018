//Contient la liste des routes relativent à message 
module.exports = function(router, passport, isLoggedIn, sequelize){ 
	//Require controller modules 
	var message_controller = require('../controllers/messageController');
	var prefix = '/message';
	/// BOOK ROUTES /// 

	// GET home page 
	router.get(prefix+'/', isLoggedIn, message_controller.index);
	//GET list of received messages 
	router.get(prefix+'/list/received', isLoggedIn, message_controller.message_received_list);
	//GET list of sended messages 
	router.get(prefix+'/list/sended', isLoggedIn, message_controller.message_sended_list); 
	//POST MESSAGE 
	router.get(prefix+'/send', isLoggedIn, message_controller.message_post);

}