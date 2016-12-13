module.exports = {
	index : function(req, res, nex){

		res.render('home',{
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}
}