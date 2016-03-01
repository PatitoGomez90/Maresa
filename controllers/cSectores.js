var mSectores = require('../models/mSectores');
var mAyuda = require('../models/mAyuda');
var mAccesos = require('../models/mAccesos');

module.exports = {
	getAll: getAll,
	getAlta: getAlta,
	postAlta: postAlta,
	getModificar: getModificar,
	postModificar: postModificar,
	getDel: getDel
};

function getAll(req, res) {
	req.session.nromenu = 5;
	mAyuda.getAyudaTexto(req.session.nromenu, function (ayuda){
		mSectores.getAll(function (allsectores){
			res.render('sectoreslista', {
	        	pagename: 'Archivo de Sectores',
	        	sectores: allsectores,
	        	ayuda: ayuda[0]
	      	});
		});
	});
}

function getAlta(req, res){
	mSectores.getUltimoCodigo(function (ultimocodigo){
			res.render('sectoresalta',{
			pagename: "Alta de sectores",
			ultimocodigo: ultimocodigo[0].codigo+1
		});
	});
}

function postAlta(req, res){
	params = req.body;
	codigo = params.codigo;
	nombre = params.nombre;
	mSectores.insert(codigo, nombre, function(){
		res.redirect('sectoreslista');
	});
}

function getModificar(req, res){
	params = req.params;
	id = params.id;
	mSectores.getSectorById(id, function (sectorbyid){
		sector = sectorbyid[0];
		res.render('sectoresmodificar',{
			pagename: "Modificar Sector",
			sector: sector
		})
	})
}

function postModificar(req, res){
	params = req.body;
	id = params.id;
	codigo = params.codigo;
	nombre = params.nombre;
	activo = params.activo;
	if (activo = "on")
		activo = 1;
	else
		activo = 0;

	mSectores.update(id, codigo, nombre, activo, function(){
		res.redirect('sectoreslista');
	});
}

function getDel(req, res){
	params = req.params;
	id = params.id;

	mSectores.del(id, function(){
		res.redirect('sectoreslista');
	})
}