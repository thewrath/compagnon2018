function mainController(user){
	this.index = function(req, res){
		res.render("main/index", { connected : req.isAuthenticated() });
		
	};

	this.discover = function(req, res){
		res.render("main/discover", { connected : req.isAuthenticated() });
	};

	this.addStatus = function(req, res){
		//not implemented yet 
		console.log(req.params.username)
		user.updateUserStat(req, function(result){
			if(result){
				res.send("OK");
			}
			else{
				res.send("KO");
			}
		});
	};
}

module.exports = function(user){
	return new mainController(user);
}; 
