var utils = require("../modules/utils");
var bCrypt = require('bcrypt-nodejs');

function message(sequelize){
	//import message model 
	const Message = sequelize.import("../models/messageModel");
	const User = sequelize.import("../models/userModel");

	var findUserIdWithName = function (name, done){
		User.findOne({
			where: {
				username: name 
			}, 
			attributes:['id'],
		}).then(function(user){
			done(user);
		});
	};

	var findUserNameWithId = function(index, id, done){
		User.findOne({
			where: {
				id: id
			}, 
			attributes:['username', 'email'],
			}).then(function(user){
				done(user, index); 
			});
	}; 

	var isValidPassword = function(userpass, password) {
 
        return bCrypt.compareSync(password, userpass);
 
    };

	//add handle for done is not a function 
	this.addMessage = function(req, from, to, content, object, done){
		if(from == ""){
			req.flash('addMessage', "Veuillez entrer un nom d'utilisateur");
			return done(false); 
		}
		findUserIdWithName(from, function(fromId){
			if(fromId){
				findUserIdWithName(to, function(toId){
					 if(toId){
					 	var data = {
						 	fromUserId : fromId.id, 
						 	toUserId : toId.id,
						 	object: object,
						 	content : content
						 };

						 Message.create(data).then(function(newMessage, created){
						 	if(!newMessage){
						 		req.flash('addMessage', "le message n'a pas pu être envoyé.");
						 		return done(false);
						 	}
							if(newMessage){
								req.flash('addMessage', "le message à bien été envoyé.");
								req.flash('success', 'true');
								return done(true);
							}
						 }); 
					 }
					 else{
					 	req.flash('addMessage', "Le destinataire n'existe pas."); 
					 	return done(false); 
					 }
				}); 
			}
			else{
				req.flash('addMessage', "Messagerie error");
				return done(false); 
			}
		});
	};

	this.getMessagesFromUser = function(req, done){
		var datas = [];
		Message.findAll({
			where: {
				fromUserId: req.user.id 
			}, 
			attributes:['id','toUserId','object'],
		}).then(function(messages){
			if(messages.length > 0){
				for (var i = messages.length - 1; i >= 0; i--) {
					datas[i] = messages[i];
					//i need to be pass to the callback (undefined error catch)
					findUserNameWithId(i, messages[i].toUserId, function(user, index){
						if(user){
							datas[index]["username"] = user.username;
							datas[index]["email"] = user.email;
							datas[index]["avatarPath"] = utils.createValidPath(req, "/images/users/"+user.email+"/avatar.png");
							datas[index]["messagePath"] = utils.createValidPath(req, "/message/see/"+user.username+"/"+messages[index].id);
							//need because node is async 
							if(index == 0){
								done(true, datas); 
							} 

						}	
						else{
							//handle error if user not found 
						}
					});
				}
			}
			else{
				done(false, datas);
			}
		});
		
	};

	this.getMessagesToUser = function(req, done){
		var datas = [];
		Message.findAll({
			where: {
				toUserId: req.user.id 
			}, 
			attributes:['id','fromUserId','object','content'],
		}).then(function(messages){
			if(messages.length > 0){
				for (var i = messages.length - 1; i >= 0; i--) {
					datas[i] = messages[i];
					//i need to be pass to the callback (undefined error catch)
					findUserNameWithId(i, messages[i].fromUserId, function(user, index){
						if(user){
							datas[index]["username"] = user.username;
							datas[index]["email"] = user.email;
							datas[index]["avatarPath"] = utils.createValidPath(req, "/images/users/"+user.email+"/avatar.png");
							datas[index]["messagePath"] = utils.createValidPath(req, "/message/see/"+user.username+"/"+messages[index].id);
							//need because node is async 
							if(index == 0){
								done(true, datas); 
							} 

						}	
						else{
							//handle error if user not found 
							
						}
					});
				}
			}
			else{
				
				done(false, datas);
			}
		});
	};

	this.getMessage = function(req, username, messageId, done){
		User.findOne({
			where: {
				username : username
			}, 
		}).then(function(user){
			if(user){
				Message.findOne({
					where: {
						id: messageId, 
						[sequelize.Op.or]: [{toUserId: user.id}, { fromUserId: user.id}]
					}, 
					}).then(function(message){
						if(message){
							done(true, message);
						} 
						else{
							done(false, null);
						}
					});
			}
			else{
				//add flash to say connection error 
				done(false, null); 
			}
		});
	};
};

module.exports = function(sequelize){
	return new message(sequelize);
}

//eviter les messages vides 

/*to send message 
message.addMessage('thomas', 'thomas', 'content test', function(first, done){
			if(done){
				res.render('message/messageMain', {connected : req.isAuthenticated()});
			}
			else{
				res.redirect('/');
			}
		}); */