var utils = require("../modules/utils");
var bCrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs-extra');
var util = require('util');
var mkdirp = require('mkdirp');

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
			attributes:['username', 'email', 'userPath'],
			}).then(function(user){
				done(user, index); 
			});
	}; 

	var isValidPassword = function(userpass, password) {
 
        return bCrypt.compareSync(password, userpass);
 
    };

    var generateHash = function(text, saltSize, isPassword) {
		var hash = bCrypt.hashSync(text, bCrypt.genSaltSync(saltSize), null);
		if(!isPassword){
		var n = ((hash.search("/") > hash.search(".")) ? hash.search("/") : hash.search("."));
			console.log("REPLACE ALL WRONG CHAR")
			console.log(hash); 
			//use regex to delete all / and ..  
			for (var i = 0; i < n ; i++) {
				hash = hash.replace("/", "a");
				hash = hash.replace(".", "b");
			}	
			console.log(hash);
		}
        return hash;
    };

	//add handle for done is not a function 
	this.addMessage = function(req, done){
		var form = new formidable.IncomingForm()
		form.uploadDir = "./temp"
		form.multiples = true;
		form.keepExtensions = true;

        form.parse(req, function (err, fields, files){
		    console.log(fields);
			console.log(files);
			var to = fields.username;
			var from = req.user.username;
			var content = fields.content;
			var object = fields.object;
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
							 	attachmentPath: generateHash(from, 2, false),
							 	asAttachment: files.attachment.length,
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
									//creer le dossier et ranger le fichier dedans + delete les fichiers temporaire
									mkdirp('./public/images/messages/'+newMessage.attachmentPath+"/", function(err){
										for (var i = files.attachment.length - 1; i >= 0; i--) {
											fs.rename(files.attachment[i].path, './public/images/messages/'+newMessage.attachmentPath+"/"+files.attachment[i].name, function(err) {
									        if (err)
									            throw err;
								          	console.log('renamed complete');  
									        });
										}
										return done(true);
										
									});
									
									
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
							datas[index]["avatarPath"] = utils.createValidPath(req, "/images/users/"+user.userPath+"/avatar.png");
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
							datas[index]["avatarPath"] = utils.createValidPath(req, "/images/users/"+user.userPath+"/avatar.png");
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

	this.getMessage = function(req, done){
		var username = req.params.username;
		var messageId = req.params.messageId;
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

