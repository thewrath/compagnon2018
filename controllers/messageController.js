//var Message = require('../models/message');

/**
 * @brief retourne la page index de message
 * @details [long description]
 * 
 * @param req requete pour accèder à la ressource
 * @param res reponse contenant la ressource 
 * 
 * @return void 
 */

exports.index = function(req, res){
	res.render('message/messageMain', {connected : req.isAuthenticated()});
};

/**
 * @brief retourne la page des envoyés reçus
 * @details [long description]
 * 
 * @param req requete pour accèder à la ressource
 * @param res reponse contenant la ressource 
 * 
 * @return void 
 */

exports.message_sended_list = function(req, res){
	res.send("NOT IMPLEMENTED YET",{ connected : req.isAuthenticated() });
};

/**
 * @brief retourne la page des message reçus
 * @details [long description]
 * 
 * @param req requete pour accèder à la ressource
 * @param res reponse contenant la ressource 
 * 
 * @return void 
 */

exports.message_received_list = function(req, res){
	res.send("NOT IMPLEMENTED YET", { connected : req.isAuthenticated() });
};

/**
 * @brief retourne le contenu d'un message
 * @details [long description]
 * 
 * @param req requete pour accèder à la ressource
 * @param res reponse contenant la ressource 
 * 
 * @return void 
 */

exports.message_get = function(req, res){
	res.send("NOT IMPLEMENTED YET" , { connected : req.isAuthenticated() });
};

/**
 * @brief ajoute un nouveau message 
 * @details [long description]
 * 
 * @param req requete pour accèder à la ressource
 * @param res reponse contenant la ressource 
 * 
 * @return void 
 */

exports.message_post = function(req, res){
	res.send("NOT IMPLEMENTED YET", { connected : req.isAuthenticated() });
};

