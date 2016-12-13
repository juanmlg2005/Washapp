//Cargamos automaticamente todos los controladores de la carpeta controllers
//Variable fs requiere el modulo fs
var fs = require('fs');
var path = require('path');
//vamos a leer del directorio actual
var files = fs.readdirSync(__dirname);
//recorremosc on un for los archivos para ejecutar los controladores automaticamente
files.forEach(function(file){
	var fileName = path.basename(file, '.js');
// Si el archivos existe esportamos los modulos
	if(fileName !== 'index'){
		exports[fileName] = require('./'+ fileName);
	}
});