//var Message = require('../models/map');

/**
 * @brief retourne la page index de map
 * @details [long description]
 * 
 * @param req requete pour accèder à la ressource
 * @param res reponse contenant la ressource 
 * 
 * @return void 
 */

exports.index = function(req, res){
	res.render('map/map', { data : null });
};