var bcrypt = require('bcrypt-nodejs');

//DEFINITION de user 
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
      		primaryKey: true, 
		},
		username: {
			type: DataTypes.STRING, 
		},
		password: {
			type: DataTypes.STRING, 
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING, 
			validate: {
                isEmail: true
            },
		},
		adresse: {
			type: DataTypes.STRING, 
		},
		city:{
			type: DataTypes.STRING,
		},
		state: {
			type: DataTypes.STRING, 
		},
		zip: {
			type: DataTypes.INTEGER, 
		},
		linkWith: {
			type: DataTypes.INTEGER,
		}
	});
	User.prototype.generateHash = function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	User.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);	
	};
	return User;
};

/////////////////////// réecrire les données 