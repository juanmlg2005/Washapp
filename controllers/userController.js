var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var myJSON;
var jsonH;
var datos;
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
		//Ruta para insertar una pedido
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
			precio : req.body.precio
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
		//Verificamos si esta logeado en el sistema, si no manda al login
		res.render('users/ePanel', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user,
			cpedido: ''
		});
		},
	postePanel : function (req, res,next)
	    {
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		//Abrimos conexion a la base de datos
		db.connect();
		//Realizamos la busqueda de informacion mediante el siguiente query
		//Pasamos los valores por placeholders valor buscar que traemos del formulario
		  db.query('SELECT * FROM pedido WHERE idPedido = ? AND usuario = ?', [req.body.idPedido,req.user.usuario] ,function(err, row, fields)
		{
			if(err) console.log(err);
			//Verificamos si existe registro en la base de datos si no existe, asignamos valor a myJSON
			if(row == 0) myJSON = 'No existe registro';
			//Si existe valor en la base de datos, asignamos el valor en formato string, Usamos JSON.Stringify para cambia de JSON a String
			else
			{
			myJSON = JSON.stringify(row[0].estatus)}
			if(err) console.log(err);
			//Retornamos el valor del json en la variable myJSON la cual contiene un string
			return myJSON;
			db.end();
		});
		  console.log(myJSON);
		  //Volvemos a renderizar la pagina verificando que el usuario este logeado en el sistema
		  res.render('users/ePanel', {
		  	isAuthenticated : req.isAuthenticated(),
			user : req.user,
			cpedido: myJSON
		});
		},
	postmestatus : function (req, res,next)
	    {
	 		res.render('users/mestatus', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		//Abrimos conexion a la base de datos
		db.connect();
	
		var mpedido = {
			idPedido : req.body.id,
			estatus :req.body.estatus,
		};
		var id ={
				idPedido : req.body.id
		};
		//Realizamos el update mediante el siguiente QUERY
		//Pasamos los valores por placeholders valor buscar que traemos del formulario
		//Sintaxis UPDATE [Nombre de la tabla] SET [Columnas de la tabla] WHERE [Donde se modificara la fila]
		db.query('UPDATE pedido SET ? WHERE idPedido = ?' , [mpedido,id] ,function(err, row, fields){
			if(err) throw err;
			console.log('Nel No funciona');
 		 	//Cerramos la conexion a la base de datos
			db.end();
			});
		console.log('funciona');
		return res.redirect('/users/mestatus');
	},
	getmestatus : function (req, res,next)
	    {
	 		res.render('users/mestatus', {
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
        return res.redirect('/users/mestatus');
	},
	postcHistorial : function(req,res,next)
{
		var config = require('.././database/config');
		var db = mysql.createConnection(config);
		//Abrimos conexion a la base de datos
		db.connect();
		//Realizamos la busqueda de informacion mediante el siguiente query
		//Pasamos los valores por placeholders valor buscar que traemos del formulario y agregamos el usuario que esta loggeado para prevenir que vea los datos de otros usuarios
		 db.query('SELECT * FROM pedido WHERE fecha >= ? AND fecha < ? AND usuario = ?', [req.body.fInicio,req.body.fFinal,req.user.usuario]  ,function(err, row, fields)
		{
			if(row == 0) jsonH= 'Sin registros o seleccione otro criterio';
			else
			{
			//Pasamos el estatus de formato JSON a String y lo proyectamos por consola para verificar funcionamiento
			for (var f=0;f<row.length;f++){
				datos+='Prenda: '+row[f].prenda;
				datos+='Cantidad: '+row[f].cantidad;
				datos+='Nombre: '+row[f].nombre;
				datos+='E-mail: '+row[f].email;
				datos+='Telefono: '+row[f].telefono;
				datos+='Direccion: '+row[f].direccion;
				datos+='esatus: '+row[f].estatus;
				datos+='precio: '+row[f].precio;
				datos+='Fecha: '+row[f].fecha;
				console.log(datos);
			}
			jsonH = JSON.stringify(row[0]);}
			if(err) console.log(err);
			return jsonH;
			db.end();
		});
		 console.log(jsonH);
		 res.render('users/cHistorial', {
		  	isAuthenticated : req.isAuthenticated(),
			user : req.user,
			cpedido: jsonH
		});
},
getcHistorial : function(req,res,next)
{
res.render('users/cHistorial', {
				isAuthenticated : req.isAuthenticated(),
			user : req.user,
		});
}

}
