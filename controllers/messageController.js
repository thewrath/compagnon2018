//var Message = require('../models/message');
function messageController(message){

	this.index = function(req, res){
		message.getMessagesFromUser(req);
		res.render('message/messageMain', { connected : req.isAuthenticated(), message: req.flash('addMessage'), success : req.flash('success')});
	};

	this.message_sended_list = function(req, res){
		res.send("NOT IMPLEMENTED YET",{ connected : req.isAuthenticated() });
	};

	this.message_received_list = function(req, res){
		res.send("NOT IMPLEMENTED YET", { connected : req.isAuthenticated() });
	};

	this.message_get = function(req, res){
		res.send("NOT IMPLEMENTED YET" , { connected : req.isAuthenticated() });
	};

	this.message_post = function(req, res){
		console.log(req);
		message.addMessage(req, req.user.username,req.body.username, req.body.content, req.body.object, function(success){
			res.redirect('/message'); 
		}); 	
	};

}

module.exports = function(message){
	return new messageController(message);
}; 

