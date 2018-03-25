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
				done(user.dataValues, index); 
			});
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
			attributes:['toUserId','object','content'],
		}).then(function(messages){
			for (var i = messages.length - 1; i >= 0; i--) {
				datas[i] = messages[i].dataValues;
				//i need to be pass to the callback (undefined error catch)
				findUserNameWithId(i, messages[i].dataValues.toUserId, function(user, index){
					datas[index]["username"] = user.username;
					datas[index]["email"] = user.email;
					//need because node is async 
					if(index == 0){
						done(datas); 
					} 
				});
			}
			
		});
		
	};

	this.getMessagesToUser = function(req, done){
		var datas = [];
		Message.findAll({
			where: {
				toUserId: req.user.id 
			}, 
			attributes:['fromUserId','object','content'],
		}).then(function(messages){
			for (var i = messages.length - 1; i >= 0; i--) {
				datas[i] = messages[i].dataValues
				findUserNameWithId(i, messages[i].dataValues.fromUserId, function(user, index){
					datas[index].username = user.username;
					datas[index]["email"] = user.email;
					if(index == 0){
						done(datas); 
					} 
				});
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