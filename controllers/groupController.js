exports.index = function(req, res){
	res.render("group/group", { connected : req.isAuthenticated() });
	
}