var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt =  require('bcryptjs');
module.exports = function(passport){

	passport.serializeUser(function(user,done){
		done(null, user);
	});

	passport.deserializeUser(function(obj, done){
		done(null, obj);
	});

	passport.use(new LocalStrategy({
		passReqToCallback : true

	}, function(req, usuario, password, done){
		console.log(usuario);
		console.log(password);
		
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		db.connect();
		db.query('SELECT * FROM lavanderia WHERE usuario = ?', usuario, function(err, rows, fields){
				if(err) throw err;
						db.end();
				if(rows.length > 0){
					var user = rows[0];
					//Comparamos el password con el del formulario si concuerdan retornamos el usuario
					if (bcrypt.compareSync(password, user.contraseña)) {
    						 console.log("Password correct");
   							 return done(null, user);
				}
			}
		return done (null, false, req.flash('authmessage', 'Usuario o contraseña incorrectos'));

		});
	}
	));

};