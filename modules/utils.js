var port = ":3000"; 

exports.createValidPath = function(req, path){
	return req.protocol+"://"+req.hostname+port+path; 
};