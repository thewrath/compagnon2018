//var Message = require('../models/message');
function messageController(message){

	this.index = function(req, res){
		res.render('message/messageMain', {connected : req.isAuthenticated()});
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
		res.send("NOT IMPLEMENTED YET", { connected : req.isAuthenticated() });
	};

}

module.exports = function(message){
	return new messageController(message);
}; 

