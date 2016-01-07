var mCC = require('../models/mCentrosCosto');
var mAyuda = require('../models/mAyuda')
var mSectores = require('../models/mSectores');

module.exports = {
	getLista: getLista,
	getAlta: getAlta,
	postAlta: postAlta,
	getModificar: getModificar,
	postModificar: postModificar,
	getDel: getDel
}

function getLista(req, res) {
	req.session.nromenu = 17;
	mCC.getAll(function (centroscosto){
		res.render('cclista', {
        	pagename: 'Lista de Centros de Costos',
        	centroscosto: centroscosto
		});    
	});
}

function getAlta(req, res){
	mSectores.getAllActivos(function (sectores){
		res.render('ccalta', {
			pagename: 'Agregar Nuevo Centro de Costo',
			sectores: sectores
		});
	});
}

function postAlta(req, res){
	params = req.body;
	codigo = params.codigo;
	nombre = params.nombre;

	mCC.insert(codigo, nombre, function (){
		res.redirect('cclista');
	});
}

function getModificar(req, res){
	params = req.params;
	id = params.id;

	mCC.getById(id, function (centrocosto){
		res.render("ccmodificar", {
			pagename: "Modificar Centro de Costo",
			centrocosto: centrocosto[0]
		});
	});
}

function postModificar(req, res){
	params = req.body;
	id = params.ccid;
	codigo = params.codigo;
	nombre = params.nombre;

	mCC.update(id, codigo, nombre, function (){
		res.redirect('cclista');
	});
}

function getDel(req, res){
	params = req.params;
	id = params.id;

	mCC.del(id, function (){
		res.redirect('cclista');
	});
}