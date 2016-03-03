var mOrdenesCompra = require('../models/mOrdenesCompra');
var mAyuda = require('../models/mAyuda');
var mPA = require('../models/mPedidosAbastecimiento');
var mProveedores = require('../models/mProveedores');

var async = require('async');
var mysql = require('mysql');

module.exports = {
	getLista: getLista,
	getAlta: getAlta,
	postAlta: postAlta,
	getPrint: getPrint
}

function changeDate(date){
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
	return fechaus;
	// output: yyyy/mm/dd
}

function getLista(req, res) {
	mPA.getItemsAprobadosSinOrden(function (pa){
		res.render('ordencompra_lista_items', {
	    	pagename: 'Lista de Items listos para incluir en Orden de Compra',
	    	pa: pa,
	    	cantidad_items: pa.length
	  	});
	});
}

function getAlta(req, res){
	var params = req.params;
	var aItems = params.aItems;
	var cant_items = params.cant_items;

	mPA.getItemsByPAIdFromArray(aItems, function (pa){
		mProveedores.getAll(function (proveedores){
			res.render("ordencompra_alta", {
				pagename: "Alta de Orden de Compra",
				pa: pa,
				proveedores: proveedores,
				cant_items: cant_items
			});
		});
	});	
}

function postAlta(req, res){
	var params = req.body;
	// console.log(params);
	var cant_items = params.cant_items;
	var fecha_necesidad = params.fecha_necesidad;
	var fecha_generacion = params.fecha_generacion;
	var id_usuario_emite = req.session.user.unica;
	var id_proveedor = params.proveedor;
	var observaciones = params.observaciones;
	var a_id_pa = params.id_pa;
	var a_cant_acomprar = params.cantidad_acomprar;
	var a_precio_unitario = params.precio_unitario;

	fecha_generacion = changeDate(fecha_generacion);
	fecha_necesidad = changeDate(fecha_necesidad);

	var connection = mysql.createConnection({
		user: 'root',
		password: '',
		host: '127.0.0.1',
		port: '3306',
		database: 'Maresa',
		dateStrings : true
	});	
	connection.connect();
	
	if (cant_items == 1){
		if (a_cant_acomprar != 0 && a_cant_acomprar != ''){
			mOrdenesCompra.insert(fecha_generacion, fecha_necesidad, id_usuario_emite, id_proveedor, observaciones, function(){		
				mOrdenesCompra.getLastId(function (ordencompra){

					var ultimo_id_oc = ordencompra[0].id;

					query = "UPDATE pedidos_abastecimiento SET id_orden_compra_fk = "+ultimo_id_oc+", precio_unitario = "
					+a_precio_unitario+", cantidad_orden_compra = "+a_cant_acomprar+" where pedidos_abastecimiento.id = "+a_id_pa

					connection.query(query, function (err, rows, fields) {
						if (err){
							throw err;
							console.log(err);
						}else{
							console.log(query);
							console.log("No errors in the query.");
							// ACA EN VEZ DE REDIRIGIR A LA LISTA DE ITEMS NUEVAMENTE, DEBE IR A LA VISTA DE IMPRESION
							// EN LA VISTA DE IMPRESION: ON_PAGE_LOADED = PRINT()
							// res.redirect("ordencompra_lista_items");
							res.redirect("ordencompra_print/"+ultimo_id_oc);
						}					
					});
				});
			});
		}else{
			//error
			res.redirect("ordencompra_lista_items");
		}
	}else{
		mOrdenesCompra.insert(fecha_generacion, fecha_necesidad, id_usuario_emite, id_proveedor, observaciones, function(){		
			mOrdenesCompra.getLastId(function (ordencompra){
				var ultimo_id_oc = ordencompra[0].id;
				var cant_desestimadas = 0;

				async.eachSeries(a_id_pa, function (idpa, callback) {

					var index = a_id_pa.indexOf(idpa);
					// console.log("index: "+index)
					var cant_a_comprar = a_cant_acomprar[index];
					var precio_unitario = a_precio_unitario[index];

					if (precio_unitario == '')
						precio_unitario = 0;

					if (cant_a_comprar != 0 && cant_a_comprar != ''){

						query = "UPDATE pedidos_abastecimiento SET id_orden_compra_fk = "+ultimo_id_oc+", precio_unitario = "
						+precio_unitario+", cantidad_orden_compra = "+cant_a_comprar+" where pedidos_abastecimiento.id = "+idpa

						connection.query(query, function (err, rows, fields) {
							if (err){
								throw err;
								console.log(err);
							}else{
								console.log(query);
								console.log("No errors in the query.");
								callback();
							}					
						});
					}else{
						//error
						cant_desestimadas = cant_desestimadas+1;
						callback();
					}
					
				}, function (err) {
					//Esta parte se sejecuta cuando termina de recorrer el array				
					if (err) { throw err; }
					if (cant_desestimadas != cant_items){
						// ACA EN VEZ DE REDIRIGIR A LA LISTA DE ITEMS NUEVAMENTE, DEBE IR A LA VISTA DE IMPRESION
							// EN LA VISTA DE IMPRESION: ON_PAGE_LOADED = PRINT()
						res.redirect("ordencompra_lista_items");
					}else{
						//error
						mOrdenesCompra.del(ultimo_id_oc, function(){
							// ACA EN VEZ DE REDIRIGIR A LA LISTA DE ITEMS NUEVAMENTE, DEBE IR A LA VISTA DE IMPRESION
							// EN LA VISTA DE IMPRESION: ON_PAGE_LOADED = PRINT()
							// res.redirect("ordencompra_lista_items");
							res.redirect("ordencompra_print/"+ultimo_id_oc);
						});
					}				
				});
			});
		});
	}				
}

function getPrint(req, res){
	var params = req.params;
	var id_oc = params.id_oc;

	mOrdenesCompra.getById(id_oc, function (orden_compra){
		mPA.getAllBy_oc_id(id_oc, function (pa){
			res.render("ordencompra_print", {
				pagename: "Imprimir Orden de Compra",
				orden_compra: orden_compra[0],
				pa: pa
			});
		});		
	});
}