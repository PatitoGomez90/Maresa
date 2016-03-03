var mPA = require('../models/mPedidosAbastecimiento');
var mAyuda = require('../models/mAyuda');
var mArt = require('../models/mArticulos');
var mSectores = require('../models/mSectores');
var mEmple = require('../models/mEmple');
var mCC = require('../models/mCentrosCosto');

var mysql = require('mysql');
var async = require('async');
// var LocalStorage = require('node-localstorage').LocalStorage,
// localStorage = new LocalStorage('./scratch');

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
	postAltaArt: postAltaArt,
	getPAsfiltrado: getPAsfiltrado,
	postMarcarRevisado: postMarcarRevisado,
	postMarcarAprobado: postMarcarAprobado,
	postMarcarRechazado: postMarcarRechazado,
	getModificar: getModificar,
	postModificar: postModificar,
	getDel: getDel,
	getPrintPA: getPrintPA
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
	var objDatos = params.objDatos;
	var objDatosParsed = "";
	tipo_de_objDatos = typeof objDatos;

    if (tipo_de_objDatos === "string"){
		objDatosParsed = JSON.parse(objDatos);			
	}else if (tipo_de_objDatos === "object"){
		var stringiii = JSON.stringify(objDatos);
		objDatosParsed = JSON.parse(stringiii);	
	} else {
		console.log("No es ni string ni object, es: "+tipo_de_objDatos);
	}

	var aArt = objDatosParsed.aArticulos;
	var fecha_generacion = params.fecha_generacion;
	var id_sector = params.sector;
	// console.log(req.session.user);
	var id_usuario_logeado = req.session.user.unica;

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
				+"id_articulo_fk, cantidad, urgente, id_sector_fk, estado, id_confecciono_fk) "+
				"values("+nro_pa+", '"+fecha_generacion+"', "+id_centro_costo+", "+id_responsable+", '"+fecha_necesidad+"', "
					+id_articulo+", "+cantidad+", "+urgente+", "+id_sector+", 'a Revisar', "+id_usuario_logeado+")"

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

function getPAsfiltrado(req, res){
	params = req.params;
	opcion = params.opcion;
	fecha_desde = params.desde;
	fecha_hasta = params.hasta;
	tipo_fecha = params.tipo_fecha;

	fecha_desde = changeDate(fecha_desde);
	fecha_hasta = changeDate(fecha_hasta);

	// console.log(params)

	var query = "SELECT pedidos_abastecimiento.*, centro_costos.nombre as centrocostotxt, secr.usuario as confeccionotxt, "
	+"DATE_FORMAT(pedidos_abastecimiento.fecha_necesidad, '%d/%m/%Y') as fecha_necf, "
	+"(SELECT secr.usuario from secr where secr.unica = pedidos_abastecimiento.id_autorizo_fk ) as autorizotxt, "
	+"DATE_FORMAT(pedidos_abastecimiento.fecha_autorizado, '%d/%m/%Y') as fecha_autorizadof, "
	+"CASE WHEN urgente = '0' THEN 'No' WHEN urgente = '1' THEN  'Si' ELSE '' END as urgentetxt, "
	+"umed.nombre as umedtxt, "
	+"articu.Nombre as articulotxt "
	+"from pedidos_abastecimiento "
	+"left join centro_costos on centro_costos.id = pedidos_abastecimiento.id_centrocosto_fk "
	+"left join secr on secr.unica = pedidos_abastecimiento.id_confecciono_fk "
	+"left join articu on articu.id = pedidos_abastecimiento.id_articulo_fk "
	+"left join umed on umed.id = articu.IdUmed "
	+"where ";

	if (tipo_fecha == '0')
		query = query + "fecha_gen >= '"+fecha_desde+"' and fecha_gen <= '"+fecha_hasta+"' ";
	else if (tipo_fecha == '1')
		query = query + "fecha_necesidad >= '"+fecha_desde+"' and fecha_necesidad <= '"+fecha_hasta+"' ";
	else
		query = query.slice(0, -6);

	if (opcion == '0'){
		query += "";
	}else if (opcion == '1'){
		if (tipo_fecha != 2)
			query += "AND estado = 'Aprobado'";
		else
			query += "where estado = 'Aprobado'";
	}else if (opcion == '2'){
		if (tipo_fecha != 2)
			query += "AND estado = 'a Aprobar'";
		else
			query += "where estado = 'a Aprobar'";
	}else if (opcion == '3'){
		if (tipo_fecha != 2)
			query += "AND estado = 'No Aprobado'";
		else
			query += "where estado = 'No Aprobado'";
	}else if (opcion == '4'){
		if (tipo_fecha != 2)
			query += "AND estado = 'a Revisar'";
		else
			query += "where estado = 'a Revisar'";
	}
	// console.log("query= "+ query);
	mPA.getPAsfiltrados(query, function (pas){
		// console.log(pas.length)
		res.send(pas);
	});
}

function postMarcarRevisado(req, res){
	var params = req.params;
	var id_pa = params.id;

	mPA.postMarcarRevisado(id_pa, function (){
		res.send("marcado como revisado! ")
	});
}

function postMarcarAprobado(req, res){
	var params = req.params;
	var id_pa = params.id;
	var cant = params.cant;
	var id_aprobo = req.session.user.unica;

	var myDate = new Date(); 
	myDate.setFullYear(myDate.getFullYear());
	day = myDate.getDate();
	if (day<10)
		day = "0"+day;
	month = myDate.getMonth()+1;
	if (month<10)
		month = "0"+month
	Today = day + "/" + month + "/" + myDate.getFullYear();

	var fecha_aprobado = changeDate(Today);

	mPA.postMarcarAprobado(id_pa, cant, id_aprobo, fecha_aprobado, function (){
		res.send("marcado como aprobado! ")
	});
}

function postMarcarRechazado(req, res){
	var params = req.params;
	var id_pa = params.id;
	var motivo = params.motivo;
	var id_rechazo = req.session.user.unica;

	var myDate = new Date(); 
	myDate.setFullYear(myDate.getFullYear());
	day = myDate.getDate();
	if (day<10)
		day = "0"+day;
	month = myDate.getMonth()+1;
	if (month<10)
		month = "0"+month
	Today = day + "/" + month + "/" + myDate.getFullYear();

	var fecha_rechazado = changeDate(Today);

	mPA.postMarcarRechazado(id_pa, motivo, id_rechazo, fecha_rechazado, function (){
		res.send("marcado como rechazado! ")
	});
}

function getModificar(req, res){
	var params = req.params;
	var id_pa = params.id;

	mPA.getItemById(id_pa, function (pa){
		mArt.getAll(function (arts){
			mEmple.getAllActivos(function (emples){
				mSectores.getAll(function (sectores){
					mCC.getAll(function (centros){
						res.render("pamodificar", {
							pagename: 'Modificar Registo de Pedido de Abastecimiento',
							pa: pa[0],
							articulos: arts,
							emples: emples,
							sectores: sectores,
							centros: centros
						});
					});
				});
			});
		});
	});
}

function postModificar(req, res){
	var params = req.body;
	var id_pa = params.id_pa;
	var id_art = params.articulo; 
	var cant = params.cantidad;
	var fecha_necf = params.fecha_necesidad;
	var fecha_nec = changeDate(fecha_necf);
	var id_responsable = params.responsable;
	var id_centrocosto = params.centrocosto;
	var urgente = params.urgente;
	var id_sector = params.sector;

	mPA.update(id_pa, id_art, cant, fecha_nec, id_responsable, id_centrocosto, urgente, id_sector, function (){
		res.redirect("palista");
	});
}

function getDel(req, res){
	var params = req.params;
	var id_pa = params.id;

	mPA.del(id_pa, function(){
		res.redirect('palista');
	});
}

function getPrintPA(req, res){
	var params = req.params;
	var nro_pa = params.nro_pa;

	mPA.getByNroPA(nro_pa, function (pa){
		res.render("paprint", {
			pagename: "Listado de elementos de Pedido de Abastecimiento N° "+nro_pa+".",
			pa: pa
		});
	});
}