$(function(){
	$('.panel-pedido form').form({
		nombre : {
			identifier : 'nombre',
			rules : [
				{
					type: 'empty',
					prompt : 'Por favor ingrese un nombre'
				}

			]
		}

	});
});