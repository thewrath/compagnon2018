
/// BOOK ROUTES /// 
module.exports = function(router, passport, isLoggedIn, sequelize){
	//Require controller modules 
	var prefix = '/group';
	var group_controller = require('../controllers/groupController');
	router.get(prefix+'/', isLoggedIn, group_controller.index);
};