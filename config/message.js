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

	var findUserNameWithId = function(name){
		return 2;
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