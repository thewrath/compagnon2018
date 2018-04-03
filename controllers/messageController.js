//var Message = require('../models/message');
function messageController(message){

	this.index = function(req, res){
		message.getMessagesFromUser(req, function(messagesFromUser){
			message.getMessagesToUser(req, function(messagesToUser){
				console.log(messagesFromUser);
				console.log(messagesToUser);
				res.render('message/messageMain', { connected : req.isAuthenticated(), message: req.flash('addMessage'), success : req.flash('success'), messagesFrom : messagesFromUser, messagesTo: messagesToUser});				
			}); 
			
		});
		
	};

	this.message_post = function(req, res){
		console.log(req);
		message.addMessage(req, req.user.username,req.body.username, req.body.content, req.body.object, function(success){
			res.redirect('/message'); 
		}); 	
	};

	this.message_get = function(req, res){
		console.log(req);
		message.getMessage(req, req.params.username, req.params.messageId,function(success, messageDatas){
			if(success){
				res.render('message/messagePrint', { connected : req.isAuthenticated(), message : req.flash('printMessage'), messageDatas : messageDatas });
			}
			else{
				res.redirect('/message');
			}
		});
	};

}

module.exports = function(message){
	return new messageController(message);
}; 

