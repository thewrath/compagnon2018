var utils = require("../modules/utils");
var bCrypt = require('bcrypt-nodejs');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs-extra');
var util = require('util');

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

    var generateHash = function(text) {
 
                return bCrypt.hashSync(text, bCrypt.genSaltSync(8), null);
 
    };

    function uploadMedia (req, path) { // This is just for my Controller same as app.post(url, function(req,res,next) {....
	  var form = new formidable.IncomingForm()
	  const uploadDir = path.join(__dirname, 'public/images/messages/'+path); //i made this  before the function because i use it multiple times for deleting later
	  form.multiples = true;
	  form.keepExtensions = true;
	  form.uploadDir = uploadDir;
	  form.parse(req, (err, fields, files) => {
	    //if (err) return res.status(500).json({ error: err })
	    
	  });
	  form.on('fileBegin', function (name, file) {
	    const [fileName, fileExt] = file.name.split('.');
	    file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`);
	  });
	}

    var saveFiles = function(req,path){
    	console.log("STOCKAGE DU FICHIER");
    	var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files){
        	            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });

        form.on('fileBegin', function(name, file) {
        	file.path = path.join(__dirname, '/temp/') + file.name;
		});

        form.on('progress', function(bytesReceived, bytesExpected) {
        	var percent_complete = (bytesReceived / bytesExpected) * 100;
        	console.log(percent_complete.toFixed(2));
		});

        form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.attachment[0].path;
        /* The file name of the uploaded file */
        var file_name = this.attachment[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = path.join(__dirname, 'public/images/messages'+path+file_name);
 
        fs.copy(temp_path, new_location + file_name, function (err) {
        if (err) {
            console.error(err);
    	} else {
            console.log("success!")
        }
            });
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
						 	contentPath: generateHash(from),
						 	object: object,
						 	content : content
						 };

						 Message.create(data).then(function(newMessage, created){
						 	if(!newMessage){
						 		req.flash('addMessage', "le message n'a pas pu être envoyé.");
						 		return done(false);
						 	}
							if(newMessage){
								uploadMedia(req, newMessage.contentPath);
								//saveFiles(req, newMessage.contentPath);
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

