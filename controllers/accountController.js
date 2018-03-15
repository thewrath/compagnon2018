exports.login_get = function(req, res){
	res.render('account/accountLogin', {data : null});
};

exports.login_post = function(req, res){
	res.redirect("/");
}

exports.register_get = function(req, res){
	res.render('account/accountRegister', {data : null});
};

exports.register_post = function(req, res){
	res.redirect('/');
}

exports.manage_get = function(req, res){
	res.render('account/accountManagement', {data : null});
}

exports.manage_post = function(req, res){
	res.redirect('/account/management', { data : null });
}