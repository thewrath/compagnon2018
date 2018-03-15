var bcrypt = require('bcrypt-nodejs');

//DEFINITION de user 
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define('user', {
		id: {
			type: Sequelize.INTEGER; 
		},
		username: {
			type: Sequelize.STRING; 
		},
		password: {
			type: Sequelize.STRING; 
		},
		email: {
			type: Sequelize.STRING; 
		},
		adresse: {
			type: Sequelize.STRING; 
		},
		city:{
			type: Sequelize.STRING;
		},
		state: {
			type: Sequelize.STRING; 
		},
		zip: {
			type: Sequelize.INTEGER; 
		},
		linkWith{
			type: Sequelize.INTEGER;
		}
	});
	User.prototype.generateHash = function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	User.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.local.password);	
	};
	return User;
};