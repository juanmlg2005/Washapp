var express = require('express');
var router = express.Router();
var passport = require('passport');
var AuthMiddleware = require('.././middleware/auth');

//Importar el modulo de los controladores para traer todos los controladores
var controllers = require('.././controllers');
//Creamos una ruta con el metodo get y ejecutamos 
router.get('/', controllers.lavcontroller.index);

//rutas de usuario
router.get('/users/ppanel', controllers.userController.getppanel);
router.post('/users/ppanel', controllers.userController.postppanel);
router.get('/users/signup', controllers.userController.getSignUp);
router.post('/users/signup', controllers.userController.postSignUp);
router.get('/users/signin', controllers.userController.getSignIn);
//Control middleware para pagina de pedido
router.post('/users/ppanel',   AuthMiddleware.isLogged ,controllers.userController.postppanel);
router.get('/users/ppanel',    AuthMiddleware.isLogged ,controllers.userController.getppanel);
//Control middleware para pagina de consultar estatus
router.post('/users/ePanel', AuthMiddleware.isLogged ,controllers.userController.postePanel);
router.get('/users/ePanel',  AuthMiddleware.isLogged ,controllers.userController.getePanel);
//Control middleware para pagina de modificar estatus
router.post('/users/mestatus', AuthMiddleware.isLogged ,controllers.userController.postmestatus);
router.get('/users/mestatus',  AuthMiddleware.isLogged ,controllers.userController.getmestatus);
//Control middleware para pagina de historial
router.post('/users/cHistorial', AuthMiddleware.isLogged ,controllers.userController.postcHistorial);
router.get('/users/cHistorial',  AuthMiddleware.isLogged ,controllers.userController.getcHistorial);
router.post('/users/signin', passport.authenticate('local', {
	successRedirect : '/users/panel',
	failureRedirect : '/users/signin',
	failureFlash : true
}));
router.get('/users/logout', controllers.userController.logout);
router.get('/users/panel', AuthMiddleware.isLogged ,controllers.userController.getUserPanel);
module.exports = router;
