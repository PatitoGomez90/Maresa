var mPA = require('../models/mPedidosAbastecimiento');
var mAyuda = require('../models/mAyuda');
var mArt = require('../models/mArticulos');
var mSectores = require('../models/mSectores');
var mEmple = require('../models/mEmple');
var mCC = require('../models/mCentrosCosto');

module.exports = {
	getLista: getLista,
	getAlta: getAlta,
	getAltaArt: getAltaArt,
	postAltaArt: postAltaArt
	// getModificar: getModificar,
	// postModificar: postModificar,
	// getDel: getDel
}

function getLista(req, res) {
	mPA.getAll(function (allPA){
		res.render('palista', {
        	pagename: 'Lista de Pedidos de Abastecimiento',
        	PAs: allPA
      	}); 
	});
}

function getAlta(req, res){
	var aArt =[];
	// aca tengo q ver como traer el array de objetos para seguir agregandole e intercambiandolo en las vistas
	mSectores.getAll(function (sectores){
		mPA.getUltimoCodigo(function (ultimocodigo){
			res.render('paalta', {
				pagename: "Alta de Pedidos de Abastecimiento",
				ultimocodigo: ultimocodigo[0].codigo+1,
				sectores: sectores
			});
		});
	});		
}

function getAltaArt(req, res){
	params = req.params;
	aArt = params.aArt;

	mCC.getAll(function (centros){
		mEmple.getAllActivos(function (emples){
			mArt.getAll(function (articulos){
				res.render("paaltaart", {
					pagename: "Alta de Nuevo Articulo",
					articulos: articulos,
					emples: emples,
					centros: centros
				});
			});
		});
	});
}

function postAltaArt(req, res){
	params = req.body;
	id_articulo = params.articulo;
	cantidad = params.cantidad;
	fecha_necesidad = params.fecha_necesidad;
	id_responsable = params.responsable;
	id_centro_costo = params.centrocosto;
	urgente = params.urgente;
	aArt = params.aArt;

	objArt = {
		'id_articulo_fk': id_articulo,
		'cantidad': cantidad,
		'fecha_necesidad': fecha_necesidad,
		'id_responsable_fk': id_responsable,
		'id_centrocosto_fk': id_centro_costo,
		'urgente': urgente
	}

	aArt.push(objArt);

	mSectores.getAll(function (sectores){
		mPA.getUltimoCodigo(function (ultimocodigo){
			res.render('paalta', {
				pagename: "Alta de Pedidos de Abastecimiento",
				ultimocodigo: ultimocodigo[0].codigo+1,
				sectores: sectores,
				articulos: aArt
			});
		});
	});
}