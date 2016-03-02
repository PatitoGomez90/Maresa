//requiriendo modelo mensaje.js:
var mProveedores = require('../models/mProveedores');
var mBorro = require('../models/mBorro');

var mAyuda = require('../models/mAyuda');
var mProvincias = require('../models/mProvincias');
var mIva = require('../models/mIva');

module.exports = {
	getLista: getLista,
	getAlta: getAlta,
	postAlta: postAlta,
	getModificar: getModificar,
	postModificar: postModificar,
	getDel: getDel,
	getVer: getVer
}

function getLista(req, res) {
	// req.session.nromenu = 3;
  	mProveedores.getAll(function (proveedores){
  		res.render('proveedoreslista', {
			pagename: 'Archivo de Proveedores',
			proveedores: proveedores
		});
  	});
}

function getAlta(req, res){
	mProveedores.getLastNumero(function (proveedor){
		ultimo_numero = proveedor[0].numero;
		ultimo_numero = ultimo_numero+1;
		mProvincias.getAll(function (provincias){
			mIva.getAll(function (iva){
				res.render("proveedoresalta", {
					pagename: "Alta de Proveedor",
					provincias: provincias,
					iva: iva,
					ultimo_numero: ultimo_numero
				});
			});		
		});
	});	
}

function postAlta(req, res){
	params = req.body;
	numero = params.numero;
	razonsocial = params.razonsocial;
	direccion = params.direccion;
	localidad = params.localidad;
	id_provincia = params.provincia;
	codigopostal = params.codigopostal;
	telefono = params.telefono;
	fax = params.fax;
	cuit1 = params.cuit1;
	cuit2 = params.cuit2;
	cuit3 = params.cuit3;
	cuit = cuit1+"-"+cuit2+"-"+cuit3;
	ganancias = params.ganancias;
	id_iva = params.iva;
	celular = params.celular;
	mail = params.mail;
	contacto = params.contacto;
	diashorarios = params.diashorarios;
	calificacion = params.calificacion;

	mProveedores.verificarNumero(numero, function (proveedor){
		if (proveedor.length == 0){
			mProveedores.insert(numero, razonsocial, direccion, localidad, id_provincia, codigopostal, telefono, fax, cuit, ganancias, id_iva, celular, mail, contacto, diashorarios, calificacion, function(){
				res.redirect("proveedoreslista");
			});
		}else{
			res.render("error", {
				error: "El Numero de Proveedor ingresado ya existe."
			});
		}
	});
}

function getModificar(req, res){
	params = req.params;
	id_proveedor = params.id;
	mProveedores.getById(id_proveedor, function (proveedor){
		var cuit = proveedor[0].cuit;
		var cuit1 = cuit.substring(0,2);
		var cuit2 = cuit.substring(3,11);
		var cuit3 = cuit.substring(12,13);
		mProvincias.getAll(function (provincias){
			mIva.getAll(function (iva){
				res.render("proveedoresmodificar", {
					pagename: "Modificar Proveedor",
					proveedor: proveedor[0],
					provincias: provincias,
					iva: iva,
					cuit1: cuit1,
					cuit2: cuit2,
					cuit3: cuit3
				});
			});		
		});
	});
}	

function postModificar(req, res){
	params = req.body;
	id = params.id;
	numero = params.numero;
	razonsocial = params.razonsocial;
	direccion = params.direccion;
	localidad = params.localidad;
	id_provincia = params.provincia;
	codigopostal = params.codigopostal;
	telefono = params.telefono;
	fax = params.fax;
	cuit1 = params.cuit1;
	cuit2 = params.cuit2;
	cuit3 = params.cuit3;
	cuit = cuit1+"-"+cuit2+"-"+cuit3;
	ganancias = params.ganancias;
	id_iva = params.iva;
	celular = params.celular;
	mail = params.mail;
	contacto = params.contacto;
	diashorarios = params.diashorarios;
	calificacion = params.calificacion;

	mProveedores.update(id, numero, razonsocial, direccion, localidad, id_provincia, codigopostal, telefono, fax, cuit, ganancias, id_iva, celular, mail, contacto, diashorarios, calificacion, function(){
		res.redirect("proveedoreslista");
	});
}

function getDel(req, res){
	params = req.params;
	id_proveedor = params.id;

	mProveedores.del(id_proveedor, function (){
		res.redirect("proveedoreslista");
	});
}

function getVer(req, res){
	params = req.params;
	id_proveedor = params.id;

	mProveedores.getById(id_proveedor, function (proveedor){
		var cuit = proveedor[0].cuit;
		var cuit1 = cuit.substring(0,2);
		var cuit2 = cuit.substring(3,11);
		var cuit3 = cuit.substring(12,13);
		mProveedores.getById(id_proveedor, function (proveedor){
			res.render("proveedoresver", {
				pagename: "Ver Detalle de Proveedor",
				proveedor: proveedor[0],
				cuit1: cuit1,
				cuit2: cuit2,
				cuit3: cuit3
			});
		});
	});
}