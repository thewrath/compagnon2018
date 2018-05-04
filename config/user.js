//module used to change user stats 
function user(sequelize){

	//sequelize user model (to manage user)
	const User = sequelize.import("../models/userModel");

	this.updateUserStat = function(req, done){
		User.update(
			{ health : req.params.status },
			{ where : {username : req.params.username }}
		).then(function(affectedCount){
			console.log(affectedCount);
			if(affectedCount > 0)
				return done(true);
			else
				return done(false);
		});
		
	};
}

module.exports = function(sequelize){
	return new user(sequelize);
};