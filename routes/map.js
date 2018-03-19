//Contient la liste des routes relativent à message 
module.exports = function(router, passport, isLoggedIn, sequelize){ 
	//Require controller modules 
	var map_controller = require('../controllers/mapController');
	var prefix = '/map';
	/// BOOK ROUTES /// 

	// GET map page 
	router.get(prefix+'/', isLoggedIn, map_controller.index);

}