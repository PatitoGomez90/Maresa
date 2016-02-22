var mPA = require('../models/mPedidosAbastecimiento');
var mAyuda = require('../models/mAyuda');
var mArt = require('../models/mArticulos');
var mSectores = require('../models/mSectores');
var mEmple = require('../models/mEmple');
var mCC = require('../models/mCentrosCosto');

var mysql = require('mysql');
var async = require('async');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

function changeDate(date){
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
	return fechaus;
	// output: yyyy/mm/dd
}

module.exports = {
	getLista: getLista,
	getAlta: getAlta,
	postAlta: postAlta,
	getAltaArt: getAltaArt,
	postAltaArt: postAltaArt
	// getModificar: getModificar,
	// postModificar: postModificar,
	// getDel: getDel
}

function getLista(req, res) {
	res.render('palista', {
    	pagename: 'Bandeja de Recepcion de Pedidos de Abastecimiento'
  	});
}

function getAlta(req, res){
	var aArt =[];
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

function postAlta(req, res){
	params = req.body;
	console.log(params)
	var objDatos = params.objDatos;
	// console.log("Type de objDatos: "+typeof objDatos);
	var objDatosParsed = "";
	tipo_de_objDatos = typeof objDatos;
	console.log(tipo_de_objDatos);
	// console.log(typeof tipo_de_objDatos);

    if (tipo_de_objDatos === "string"){
		objDatosParsed = JSON.parse(objDatos);			
	}else if (tipo_de_objDatos === "object"){
		var stringiii = JSON.stringify(objDatos);
		objDatosParsed = JSON.parse(stringiii);	
	} else {
		console.log("No es ni string ni object, es: "+tipo_de_objDatos);
	}
    
	// console.log("Type de objDatosParsed: "+typeof objDatosParsed);	
	var aArt = objDatosParsed.aArticulos;
	// console.log("Type de aArt: "+typeof aArt);
	var fecha_generacion = params.fecha_generacion;
	var id_sector = params.sector;

	// console.log(fecha_generacion);

	var connection = mysql.createConnection({
		user: 'root',
		password: '',
		host: '127.0.0.1',
		port: '3306',
		database: 'Maresa',
		dateStrings : true
	});

	connection.connect();

	//pedir ultimo nro de PA antes de async
	mPA.getLastNroPa(function (ultimo_nro_pa){
		// console.log("ult nro pa");
		// console.log(ultimo_nro_pa);

		ultimo_nro_pa = ultimo_nro_pa[0].nro_pa;
		var nro_pa = 1;

		if (ultimo_nro_pa != 0)
			nro_pa = ultimo_nro_pa+1;

		fecha_generacion = changeDate(fecha_generacion);

		async.eachSeries(aArt, function (articulo, callback) {
			var id_articulo = articulo.id_articulo_fk;
			var id_responsable = articulo.id_responsable_fk;
			var id_centro_costo = articulo.id_centrocosto_fk;
			var fecha_necesidad = articulo.fecha_necesidad;
			var urgente = articulo.urgente;
			var cantidad = articulo.cantidad;

			fecha_necesidad = changeDate(fecha_necesidad);			

			var query= "insert into pedidos_abastecimiento(nro_pa, fecha_gen, id_centrocosto_fk, id_responsable_fk, fecha_necesidad, "
				+"id_articulo_fk, cantidad, urgente, id_sector_fk) "+
				"values("+nro_pa+", '"+fecha_generacion+"', "+id_centro_costo+", "+id_responsable+", '"+fecha_necesidad+"', "
					+id_articulo+", "+cantidad+", "+urgente+", "+id_sector+")"

			connection.query(query, function (err, rows, fields) {
				if (err){
					throw err;
					console.log(err)
					console.log(query);
				}else{
					console.log("No errors in the query:");
					console.log(query);
					// connection.end();
					callback();
				}
			});
		}, function (err) {
			// localStorage.clear();
			connection.end();
			// req.session.limpar = 1;
			// req.session.save();
			res.redirect('paalta');
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