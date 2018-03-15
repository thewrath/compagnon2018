
/// BOOK ROUTES /// 
module.exports = function(router, passport, sequelize){
	//Require controller modules 
	var main_controller = require('../controllers/mainController');
	// GET home page
	router.get('/', main_controller.index);
};