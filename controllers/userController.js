var mysql = require('mysql');
var bcrypt = require('bcryptjs');


module.exports = {
	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},

	postSignUp: function(req, res, next){
		var salt = bcrypt.genSaltSync(10);
		var password= bcrypt.hashSync(req.body.contraseña, salt);
		// Usamos un objeto Json
		var user = {
			nombre : req.body.nombre,
			direccion : req.body.direccion,
			telefono : req.body.telefono,
			email : req.body.email,
			usuario : req.body.usuario,
			contraseña : password

		};
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		//Abrimos conexion a la base de datos
		db.connect();
		//Insertamos el registro mediante el siguiente Query
		db.query('INSERT INTO lavanderia SET ?', user, function(err, row, fields){
			if(err) throw err;
			db.end();
		});
		//Si es exitoso mandamos mensaje flash y redireccionamos a la pagina de inicio
		req.flash('info','Se ha registrado correctamente');
        return res.redirect('/users/signin');
	},

	getSignIn: function(req, res, next){
		return res.render('users/signin', {message: req.flash('info'), authmessage : req.flash('authmessage')});
	},

	logout : function(req, res, next){

		req.logout();
		res.redirect('/users/signin');
	},

	getUserPanel : function(req, res, next){
		res.render('users/panel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		})
	},
	getppanel: function(req, res, next){
		// Usamos un objeto Json
		res.render('users/ppanel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		})
		return res.render('users/ppanel', {message: req.flash('info'), authmessage : req.flash('authmessage')});
		},
	postppanel : function(req, res, next){
		// Usamos un objeto Json
		var pedido = {
			prenda : req.body.prenda,
			cantidad : req.body.cantidad,
			nombre : req.body.nombre,
			email : req.body.email,
			telefono : req.body.telefono,
			usuario : req.body.usuario,
			direccion : req.body.telefono,
		};
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		//Abrimos conexion a la base de datos
		db.connect();
		//Insertamos el registro mediante el siguiente Query
		db.query('INSERT INTO pedido SET ?', pedido, function(err, row, fields){
			if(err) throw err;
			db.end();
		});
        return res.redirect('/users/ppanel');
    },
    getUser : function(req, res, next){ 
    	db.connect();
    db.query('SELECT * FROM pedido', function (error, results){
      if(error) throw error;
      //console.log(results);
      res.send(200, results);
      return next();
  });
	},
	showP : function(req, res,next){
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		//Abrimos conexion a la base de datos
		db.connect();
		//Insertamos el registro mediante el siguiente Query
		db.query('SELECT * FROM pedido' ,function(err, row, fields){
			if(err) throw err;
			console.log('Total de resultados' + results.length);
            console.log('Total de campos devueltos' + fields.length);
            for (var i = 0; i < results.length; i++) {
   			console.log('ID: ', results[i].ID);
 		 }
			db.end();

	});
	},
	getcpedidos : function (req, res,next)
	{
		res.render('users/cpedidos', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
		return res.redirect('/users/cpedidos');
		
	},
	postcpedidos : function (req, res,next)
	{
		return res.render('users/cpedidos', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	},
	getePanel : function (req, res,next)
	{
		res.render('users/ePanel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
		return res.redirect('/users/ePanel');
		
	},
	postePanel : function (req, res,next)
	{
		return res.render('users/ePanel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}
}
