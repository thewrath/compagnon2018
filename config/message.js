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
	this.addMessage = function(from, to, content,  done){
		findUserIdWithName(from, function(fromId){
			findUserIdWithName(to, function(toId){
				 var data = {
				 	fromUserId : fromId.id, 
				 	toUserId : toId.id,
				 	content : content
				 };

				 Message.create(data).then(function(newMessage, created){
				 	if(!newMessage){
				 		return done(null, false);
				 	}
					if(newMessage){
						return done(null, true);
					}
				 }); 
			}); 
		});
	};
};

module.exports = function(sequelize){
	return new message(sequelize);
}

/*to send message 
message.addMessage('thomas', 'thomas', 'content test', function(first, done){
			if(done){
				res.render('message/messageMain', {connected : req.isAuthenticated()});
			}
			else{
				res.redirect('/');
			}
		}); */