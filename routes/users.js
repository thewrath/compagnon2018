//Contient les routes relatif a users 
module.exports = function(router, passport, sequelize){ 
	var prefix = '/users';
	/* GET users listing. */
	router.get(prefix+'/', function(req, res, next) {
	  res.send('respond with a resource');
	});

}
