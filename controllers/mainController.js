exports.index = function(req, res){
	res.render("main/index", { data : null });
	
}

exports.discover = function(req, res){
	res.render("main/discover", { data : null });
}