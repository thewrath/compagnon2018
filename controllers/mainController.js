exports.index = function(req, res){
	res.render("main/index", { connected : req.isAuthenticated() });
	
}

exports.discover = function(req, res){
	res.render("main/discover", { connected : req.isAuthenticated() });
}