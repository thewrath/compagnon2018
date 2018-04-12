var config = require('../config/config'); 

exports.createValidPath = function(req, path){
	return req.protocol+"://"+req.hostname+":"+config.port+path; 
};