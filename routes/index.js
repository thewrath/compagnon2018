
/// BOOK ROUTES /// 
module.exports = function(router, passport, isLoggedIn, sequelize){
	//Require controller modules 
	var main_controller = require('../controllers/mainController');
	router.get('/', isLoggedIn, main_controller.index);
	router.get('/discover', main_controller.discover);
	//route pour recuperer le smiley 
	router.get('/howareyou/:id/:status', main_controller.addStatus);
};