var mPartediario1 = require('../models/mPartediario1');
var mPartediario2 = require('../models/mPartediario2');
var mAyuda = require('../models/mAyuda');
var mLugares = require('../models/mLugares');
var mSectores = require('../models/mSectores');
var mClasificacion = require('../models/mClasificacion')
var mImputacion = require('../models/mImputacion');
var mContratos = require('../models/mContratos');
var mTurnos = require('../models/mTurnos');
var mEmple = require('../models/mEmple');
var mPlanti = require('../models/mPlantillas');
var mFichadas = require('../models/mFichadas');

var mysql = require("mysql");
var async = require('async');

module.exports = {
	getLista: getLista,
	getAlta: getAlta,
	postAlta: postAlta,
	getModificar: getModificar,
	postModificar: postModificar,
	getDel: getDel,
	getClose: getClose,
	getHistorial: getHistorial,
	getVer: getVer,
	getExport: getExport
};

function changeDate(date){
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
	return fechaus;
	// output: yyyy/mm/dd
}

//el update q corre antes de cargar las fichadas
function updateFichadas(cb){
	var mysql = require('mysql');

	var connection = mysql.createConnection({
		user: 'root',
		password: '',
		host: '127.0.0.1',
		port: '3306',
		database: 'Maresa',
		dateStrings : true
	});

	var lastficid = 0;
	mFichadas.getLastFicIdMySql(function (lastficidfrommysql){
		console.log("lastficidfrommysql: "+lastficidfrommysql[0].maxfic_id)
		if(lastficidfrommysql[0].maxfic_id == null)
		lastficid = 0;
		else
		lastficid = lastficidfrommysql[0].maxfic_id;

		console.log("last fic id (en mysql) antes de la request: "+lastficid);

		mFichadas.getLatestFicSQL(lastficid, function (latestfic){
			//console.log(latestfic[0])
			console.log("length del obj latestfichadas: "+latestfic.length)//67
			var i = 0;
			var querys = [];
			for (i = 0; i < latestfic.length; i++ ){
				query = "select fic_id from fichadas where fic_id = "+latestfic[i].FIC_ID;
				querys.push({query: query, id: i});
			}

			connection.connect();
			async.eachSeries(querys, function (data, callback) {
				console.log(data.query)
				connection.query(data.query, function(err, rows, fields) {
					if (err){
						throw err;
						console.log(err)
					}else{
						console.log("No errors in the query.")
					}
					console.log(rows.length)
					if (rows.length == 0){
						mFichadas.MySqlInsert(latestfic[data.id], function (){
							console.log(data.id)
							callback();
						});
					}else{
						console.log("Registro fic_id = "+latestfic[data.id].FIC_ID+" existente en MySql");
						callback();
					}
				});

			}, function (err) {
				//Esta parte se sejecuta cuando termina de recorrer el array
				// acomode la funcion "callback" de Async, ya que sino nos queda el callback
				// de 	mFichadas.MySqlInsert dando vueltas
				if (err) { throw err; }
				return cb();
			});
			//connection.end();
		});//end mF getlatestficsql
	});
}

function getLista(req, res) {
	//req.session.nromenu = 5;
	//mAyuda.getAyudaTexto(req.session.nromenu, function (ayuda){
	updateFichadas(function () {
		mPartediario1.getAllAbiertos(function (partediario1s){
			res.render('partediario1lista', {
	        	pagename: 'Lista de Partes Diarios',
	        	partediario1s: partediario1s
	        	//ayuda: ayuda[0]
	      	}); 
		});    
	});
};

function getAlta(req, res){
	updateFichadas(function () {
		mSectores.getAllActivos(function (sectores){
			mClasificacion.getAllActivos(function (clasificaciones){
				mContratos.getAll(function (contratos){
					mPlanti.getAll_planti1(function (plantillas){
						res.render('partediario1alta', {
							pagename: "Alta de Parte Diario",
							clasificaciones: clasificaciones,
							sectores: sectores,
							contratos: contratos,
							plantillas: plantillas
						});
					});
				});
			});
		});
	});
}

function postAlta(req, res){
	params = req.body;
	fecha = params.fecha;
	fecha = changeDate(fecha);
	contrato = params.contrato;
	idsector = params.sector;
	idlugar = params.lugar;
	turno = params.turno;
	id_plantilla = params.plantilla;
	estado = 1;
	clasificacion1 = 9;
	clasificacion2 = 10;
	clasificacion3 = 11;
	clasificacion4 = 12;
	clasificacion5 = 20;
	clasificacion6 = 24;
	imputacion1 = params.imputacion1;
	imputacion2 = params.imputacion2;
	imputacion3 = params.imputacion3;
	imputacion4 = params.imputacion4;
	imputacion5 = params.imputacion5;
	imputacion6 = params.imputacion6;
	imputacion7 = params.imputacion7;
	imputacion8 = params.imputacion8;
	imputacion9 = params.imputacion9;
	imputacion10 = params.imputacion10;
	imputacion11 = params.imputacion11;
	imputacion12 = params.imputacion12;

	var connection = mysql.createConnection({
		user: 'root',
		password: '',
		host: '127.0.0.1',
		port: '3306',
		database: 'Maresa',
		dateStrings : true
	});

	mPartediario1.insert(fecha, contrato, idsector, idlugar, turno, estado, clasificacion1, clasificacion2, clasificacion3, clasificacion4, clasificacion5, clasificacion6, imputacion1, imputacion2, imputacion3, imputacion4, imputacion5, imputacion6, imputacion7, imputacion8, imputacion9, imputacion10, imputacion11, imputacion12, function(){
		mPartediario1.getLastId(function (pdultimoid){
			//console.log(pdultimoid)
			var ultimoid = pdultimoid[0].id;

			connection.connect();

			if (id_plantilla != 0){
				mPlanti.getAll_planti2(id_plantilla, function (planti2){

					// for (var x = 0 ; x < planti2.length ; x++){
					// 	//acá agregar la columna 'Numero' de empleado en los Partes Diarios
					// 	var y = x+1;
					// 	mPartediario2.insertNewEmpleado(ultimoid, planti2[x].id_emple_fk, y, function (){
					// 		bandera = true;
					// 	});
					// }
					var index = -1;
					async.eachSeries(planti2, function (planti, callback) {
						// console.log(data.query)
						index++;
						// var x = planti2.indexOf(planti);
						var numero = index+1;
						var query= "insert into partediario2(id_partediario1_fk, id_emple_fk, numero) "+
							"values("+ultimoid+", "+planti.id_emple_fk+", "+numero+")"
						connection.query(query, function(err, rows, fields) {
							if (err){
								throw err;
								console.log(err)
							}else{
								console.log("No errors in the query.");
								callback();
							}
							//console.log(rows.length)							
						});
					}, function (err) {						
						if (err) 
							throw err; 
						
						console.log("Redirigiendo a ParteDiario1 Lista..")
						res.redirect('partediario1lista');
						connection.end();				
						// return cb();
					});
				});
			}else{			
				mEmple.getByTurno(turno, function (emplesbyturno){
					console.log(emplesbyturno.length)
					var bandera = false;
					// for (var x = 0 ; x < emplesbyturno.length ; x++){
					// 	//acá agregar la columna 'Numero' de empleado en los Partes Diarios
					// 	var y = x+1;
					// 	mPartediario2.insertNewEmpleado(ultimoid, emplesbyturno[x].codigo, y, function (){
					// 		bandera = true;
					// 	});
					// }
					var index = -1;
					async.eachSeries(emplesbyturno, function (emple, callback) {
						// console.log(data.query)
						index++;
						// var x = planti2.indexOf(planti);
						var numero = index+1;
						var query= "insert into partediario2(id_partediario1_fk, id_emple_fk, numero) "+
							"values("+ultimoid+", "+emple.codigo+", "+numero+")"
						connection.query(query, function(err, rows, fields) {
							if (err){
								throw err;
								console.log(err)
							}else{
								console.log("No errors in the query.");
								callback();
							}
							//console.log(rows.length)							
						});
					}, function (err) {						
						if (err)
							throw err; 
						
						console.log("Redirigiendo a ParteDiario1 Lista..")
						res.redirect('partediario1lista');
						connection.end();
						// return cb();
					});
				});
			}
			
			// if (bandera)
			// 	console.log("Ingresados "+emplesbyturno.length+" empleados.");			
		});		
	});
}

function getModificar(req, res){
	params = req.params;
	id = params.id;

	mPartediario1.getById(id, function (partediario1){
		mLugares.getBySectorId(partediario1[0].id_sector_fk, function (lugares){
			mSectores.getAllActivos(function (sectores){
				mClasificacion.getAllActivos(function (clasificaciones){
					mImputacion.getAllActivos(function (imputaciones){
						mTurnos.getByIdSector(partediario1[0].id_sector_fk, function (turnos){
							mContratos.getAll(function (contratos){
								//console.log(partediario1[0])
								res.render('partediario1modificar', {
									pagename: "Modificar Parte Diario",
									partediario1: partediario1[0],
									imputaciones: imputaciones,
									clasificaciones: clasificaciones,
									sectores: sectores,
									lugares: lugares,
									turnos: turnos,
									contratos: contratos
								});
							});
						});
					});
				});
			});
		});
	});
}

function postModificar(req, res){
	params = req.body;
	id = params.id;
	fecha = params.fecha;
	fecha = changeDate(fecha);
	turno = params.turno;
	contrato = params.contrato;
	idsector = params.sector;
	idlugar = params.lugar;
	estado = 1;
	clasificacion1 = 9;
	clasificacion2 = 10;
	clasificacion3 = 11;
	clasificacion4 = 12;
	clasificacion5 = 20;
	clasificacion6 = 24;
	imputacion1 = params.imputacion1;
	imputacion2 = params.imputacion2;
	imputacion3 = params.imputacion3;
	imputacion4 = params.imputacion4;
	imputacion5 = params.imputacion5;
	imputacion6 = params.imputacion6;
	imputacion7 = params.imputacion7;
	imputacion8 = params.imputacion8;
	imputacion9 = params.imputacion9;
	imputacion10 = params.imputacion10;
	imputacion11 = params.imputacion11;
	imputacion12 = params.imputacion12;

	mPartediario1.update(id, fecha, contrato, idsector, idlugar, turno, estado, clasificacion1, clasificacion2, clasificacion3, clasificacion4, clasificacion5, clasificacion6, imputacion1, imputacion2, imputacion3, imputacion4, imputacion5, imputacion6, imputacion7, imputacion8, imputacion9, imputacion10, imputacion11, imputacion12, function(){
		res.redirect('partediario1lista');
	});
}

function getDel(req, res){
	params = req.params;
	id = params.id;
	mPartediario2.delByIdpartediario1(id, function (){
		mPartediario1.del(id, function (){		
			res.redirect('partediario1lista');
		});
	});
}

function getClose(req, res){
	params = req.params;
	idpd1 = params.idpd1;
	// p1.estado
	// 1 = abierto
	// 0 = cerrado

	mPartediario1.closeParteDiario(idpd1, function (){
		console.log("Parte Diario ID "+idpd1+" cerrado.");
		res.redirect('partediario1lista');
	});
}

function getHistorial(req, res){
	mPartediario1.getAllCerrados(function (partediario1s){
		res.render('partediario1historial',{
			pagename: "Historial de Partes Diarios",
			partediario1s: partediario1s
		});
	});
}

function getVer(req, res){
	params = req.params;
	idpd1 = params.idpd1;

	mPartediario1.getById(idpd1, function (partediario1){
	//console.log(partediario1[0])
		mPartediario2.getAllByPartediario1Id(idpd1, function (partediario2s){
			res.render('partediario2ver', {
	        	pagename: 'Lista de Empleados',
	        	partediario2s: partediario2s,
	        	partediario1: partediario1[0]//,
	        	//tipohoras: tipohoras
	        	//ayuda: ayuda[0]
	      	}); 
		});
	});
}

function getExport(req, res){

}