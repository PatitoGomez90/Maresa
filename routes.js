const cIndex                 = require('./controllers/cIndex');
const cUsuario               = require('./controllers/cUsuario');
const cAdmin                 = require('./controllers/cAdmin');
const cEmple                 = require('./controllers/cEmple');
const cAccesos               = require('./controllers/cAccesos');
const cCargos                = require('./controllers/cCargos');
const cUmed                  = require('./controllers/cUmed');
const cSectores              = require('./controllers/cSectores');
const cMaquinarias           = require('./controllers/cMaquinarias');
const cFamilia               = require('./controllers/cFamilia');
const cArticulos             = require('./controllers/cArticulos');
const cVales                 = require('./controllers/cVale');
const test                   = require('./controllers/cTest');
const cChk1                  = require('./controllers/cChk1');
const cChk2                  = require('./controllers/cChk2');
const mEventos               = require('./models/mEventos');
const cOt                    = require('./controllers/cOt');
const cEquipos               = require('./controllers/cEquipos');
const cTipoEquipo            = require('./controllers/cTipoEquipo');
const cEtiquetas             = require('./controllers/cEtiquetas');
const cTipoTarea             = require('./controllers/cTipoTarea');
const cModeloM1              = require('./controllers/cModeloMantenimiento');
const cModeloM2              = require('./controllers/cModeloMantenimientoDetalle');
const cItems                 = require('./controllers/cItems');
const cTipoHora              = require('./controllers/cTipoHora');
const cCodigoHora            = require('./controllers/cCodigoHora');
const cRelojes               = require('./controllers/cRelojes');
const cLugares               = require('./controllers/cLugares');
const cClasificacion         = require('./controllers/cClasificacion');
const cImputacion            = require('./controllers/cImputacion');
const cParteDiario1          = require('./controllers/cPartediario1');
const cParteDiario2          = require('./controllers/cPartediario2');
const cFichadas              = require('./controllers/cFichadas');
const cContratos             = require('./controllers/cContratos');
const cTurnos                = require('./controllers/cTurnos');
const cCategorias            = require('./controllers/cCategorias');
const cReportes              = require('./controllers/cReportes');
const cPlanti                = require('./controllers/cPlantillas');
const cCentrosCostos         = require('./controllers/cCentrosCosto');
const cPedidosAbastecimiento = require('./controllers/cPedidosAbastecimiento');
const cProveedores           = require('./controllers/cProveedores');
const cOrdenesCompra         = require('./controllers/cOrdenesCompra');

const cPruebaSQL = require('./controllers/cPruebaSQL');
const cRandom = require('./controllers/cRandom');

const mAccesos = require('./models/mAccesos');

function logout (req, res) {
	fecha = new Date();
	day = fecha.getDate();
	month = fecha.getMonth();
	if (day<10)
		day = "0" + day;
	if (month<10)
		month = "0" + month;
	fecha = fecha.getFullYear() + "/"+month+"/"+day+" "+fecha.getHours()+":"+fecha.getMinutes()
	mEventos.add(req.session.user.unica, fecha, "Logout", "", function(){
	});
	req.session = null;
	// req.session.reset();
	return res.redirect('/');
}

// Verifica que este logueado
function auth (req, res, next) {
	if (req.session.auth) {
		return next();
	} else {
		res.redirect('/')
	}
}

function acceso (req, res, next){
	// console.log("adentro")
	// ver como hacer esta funcion para que sea ejecutada desdes de los "auth" como verificador de acceso,
	// puede ser que se envien parametros con req y res, o que envie parametros comunes, más el NEXT
	// se me ocurre hacer una sola funcion con parametro 'accion' o sino hacer 4 funciones, una para cada uno a,b,m,c
	// console.log(req.session.user)
	const id_usuario = req.session.user.unica;
	const id_menu = req.session.user.id_menu;
	const accion = req.session.user.accion;

	// console.log(req.session.user)

	mAccesos.verificarAcceso(id_usuario, id_menu, accion, function (acceso){
		var acceso = acceso[0].c;
		var acciontxt = "";
		if (acceso == 1){
			next();
		}else{
			var nombre_usuario = req.session.user.usuario;
			if (accion == 'a'){
				acciontxt = "al Alta";
			}else{
				if (accion == 'b'){
					acciontxt = "a dar de Baja";
				}else{
					if (accion == 'm'){
						acciontxt = "a Modificar";
					}else{
						if (accion == 'c'){
							acciontxt = "a Consultar";
						}else{
							console.log("asd");
						}
					}
				}
			}
			mAyuda.getAyuda(id_menu, function (ayuda){
				res.render("error", {
					error: nombre_usuario+": No tiene acceso "+acciontxt+" en el menú id "+id_menu+" llamado '"+ayuda[0].titulo+"'"
				});
			});
		}
	});
}

module.exports = function(app) {
	app.get('/', cAdmin.getLogin);
	app.get('/login', cAdmin.getLogin)
	app.post('/login', cAdmin.postLogin);
	app.get('/logout', logout);
	app.get('/inicio', auth, cIndex.getInicio);
	app.get('/error', cIndex.getError);
	app.post('/updatemenuinfo/:id_menu/:accion', auth, cIndex.updateMenuInfo);
	
//ayuda
	app.get('/ayuda', cIndex.getAyuda);
	app.get('/ayudaver/:id', cIndex.AyudaVer);
//novedades
	app.get('/listanovedades', cIndex.getNovedades);
//usuarios
	app.get('/usuarioslista', auth, cUsuario.getUsuarios);
	app.get('/usuariosalta', auth, cUsuario.getUsuariosAlta);
	app.post('/usuariosalta', auth, cUsuario.putUsuario);
	app.get('/usuariosmodificar/:id', auth, cUsuario.getUsuarioModificar);
	app.post('/usuariosmodificar', auth, cUsuario.postUsuarioModificar);
	app.get('/usuariosborrar/:id', auth, cUsuario.getDelUsuario);
//configurar accesos
	app.get('/accesoslista/:id', auth, cAccesos.getAccesos);
	app.post('/accesoslista', auth, cAccesos.postAccesos);
	app.post("/updateacceso/:id_usuario/:id_menu/:acceso_short/:value", auth, cAccesos.updateAcceso);
//empleados
	app.get('/emplelista', auth, cEmple.getEmpleados);
	app.get('/emplealta', auth, cEmple.getAlta);
	app.post('/emplealta', auth, cEmple.postAlta);
	app.get('/emplemodificar/:codigo', auth, cEmple.getModificar);
	app.post('/emplemodificar', auth, cEmple.postModificar);
	app.get('/empleborrar/:codigo', auth, cEmple.getDelEmple);
	app.get('/emplever/:codigo', auth, cEmple.getVer);
	app.get('/getallemple', auth, cEmple.getAllEmple);
	app.get('/emplesexport', auth, cEmple.getExport);
	app.get('/emplefiltro', auth, cEmple.getFiltro);
	app.post('/emplefiltro', auth, cEmple.postFiltro);
//cargos de empleados
	app.get('/cargoslista', auth, cCargos.getAllCargos);
	app.get('/cargosalta', auth, cCargos.getAlta);
	app.post('/cargosalta', auth, cCargos.postAlta);
	app.get('/cargosmodificar/:id', auth, cCargos.getModificar);
	app.post('/cargosmodificar', auth, cCargos.postModificar);
	app.get('/cargosborrar/:id', auth, cCargos.getDelCargo);
//unidades de medida "umed"
	app.get('/umedlista', auth, cUmed.getAllUmed);
	app.get('/umedalta', auth, cUmed.getAlta);
	app.post('/umedalta', auth, cUmed.postAlta);
	app.get('/umedmodificar/:id', auth, cUmed.getModificar);
	app.post('/umedactualizar', auth, cUmed.postModificar);
	app.get('/umedborrar/:id', auth, cUmed.getDelUmed);

//sectores
	app.get('/sectoreslista', auth, acceso, cSectores.getAll);


	app.get('/sectoresalta', auth, cSectores.getAlta);
	app.post('/sectoresalta', auth, cSectores.postAlta);
	app.get('/sectoresmodificar/:id', auth, cSectores.getModificar);
	app.post('/sectoresmodificar', auth, cSectores.postModificar);
	app.get('/sectoresborrar/:id', auth, cSectores.getDel);
//maquinarias abm
	app.get('/maqlista', auth, cMaquinarias.getAll);
	app.get('/maqalta', auth, cMaquinarias.getAlta);
	app.post('/maqalta', auth, cMaquinarias.postAlta);
	app.get('/maqver/:id', auth, cMaquinarias.getVer);
	app.get('/maqmodificar/:id', auth, cMaquinarias.getModificar);
	app.post('/maqmodificar', auth, cMaquinarias.postModificar);
	app.get('/maqborrar/:id', auth, cMaquinarias.getDel);
//equipos/vehiculos abm
	app.get('/equipolista', auth, cEquipos.getAll);
	app.get('/equipoalta', auth, cEquipos.getAlta);
	app.post('/equipoalta', auth, cEquipos.postAlta);
	app.get('/equipomodificar/:id', auth, cEquipos.getModificar);
	app.post('/equipomodificar', auth, cEquipos.postModificar);
	app.get('/equipoborrar/:id', auth, cEquipos.getDel);
	app.get('/equipover/:id', auth, cEquipos.getVer);
//Familia de articulos
	app.get('/familialista', auth, cFamilia.getAll);
	app.get('/familiaalta', auth, cFamilia.getAlta);
	app.post('/familiaalta', auth, cFamilia.postAlta);
	app.get('/familiamodificar/:id', auth, cFamilia.getModificar);
	app.post('/familiamodificar', auth, cFamilia.postModificar);
	app.get('/familiaborrar/:id', auth, cFamilia.getDel);
//Articulos
	app.get('/articulosalta', auth, cArticulos.getAlta);
	app.post('/articulosalta', auth, cArticulos.postAlta);
	app.get('/articulosconsulta', auth, cArticulos.getConsulta);
	app.get('/articulosver/:id', auth, cArticulos.getVerArt);
	app.get('/articulosmodificar/:id', auth, cArticulos.getModificar);
	app.post('/articulosmodificar', auth, cArticulos.postModificar);
	app.get('/articulosborrar/:id', auth, cArticulos.getDel); 
	app.get('/:idart/costou', auth, cArticulos.getCostou);
	app.get('/buscarart/:columna/:busqueda', auth, cArticulos.getBuscar);
	app.get('/buscarartpornombre/:columna/:busqueda', auth, cArticulos.getBuscarPorNombre);
	app.get('/getartporcdfabrica/:cdfabrica', auth, cArticulos.getArtporCdFabrica2);
//etiquetas
	app.get('/addartaetiquetas/:id', auth, cEtiquetas.addArt);
	app.get('/articulosimprimir', auth, cEtiquetas.getImprimir);
	app.get('/articulosimprimirlimpiar', auth, cEtiquetas.getListaImpresion);
	//get borrar fila
	app.get('/articulosimmprimirborrarfila/:id', auth, cEtiquetas.getBorrarFila);
	//get borrar todo
	app.get('/articulosimprimirborrartodo', auth, cEtiquetas.getBorrarTodo);
//VALES
	app.get('/valesalta', auth, cVales.getAlta);
	app.post('/valesalta', auth, cVales.postAlta);
	app.get('/valesconsulta', auth, cVales.getConsulta);
	app.get('/buscarvales/:finicio/:ffin/:sector', auth, cVales.getVales);
	app.get('/valesver/:id', auth, cVales.getVerVales);
	app.get('/valesborrar/:id', auth, cVales.getDel);
	app.get('/getayudaporid/:id', auth, cVales.getAyuda);
	app.post('/printselection', auth, cVales.getPrintSelection);
	//prueba xls to json
	app.get('/test', auth, test.getTest);
//checklist 1 02/07/2015-> ahora se llama Modelo de Checklist [ABM]
	app.get('/chk1lista', auth, cChk1.getLista);
	app.get('/chk1alta', auth, cChk1.getAlta);
	app.post('/chk1alta', auth, cChk1.postAlta);
	//chkborrar
//checklist 2
	app.get('/chk2lista/:id', auth, cChk2.getLista);
	app.get('/chk2alta/:id', auth, cChk2.getAlta);
	app.post('/chk2alta', auth, cChk2.postAlta);
	app.get('/chk2modificar/:id', auth, cChk2.getModificar);
	app.post('/chk2modificar', auth, cChk2.postModificar);
	app.get('/chk2borrar/:id', auth, cChk2.getDel);
//ot
	app.get('/otlista', auth, cOt.getLista);
	app.get('/otalta', auth, cOt.getAlta);
	app.post('/otalta', auth, cOt.postAlta);
	app.get('/otmodificar/:id', auth, cOt.getModificar);
	app.post('/otmodificar', auth, cOt.postModificar);
//tipo equipos
	app.get('/tipoequipolista', auth, cTipoEquipo.getAll);
	app.get('/tipoequipoalta', auth, cTipoEquipo.getAlta);
	app.post('/tipoequipoalta', auth, cTipoEquipo.postAlta);
	app.get('/tipoequipomodificar/:id', auth, cTipoEquipo.getModificar);
	app.post('/tipoequipomodificar', auth, cTipoEquipo.postModificar);
	app.get('/tipoequipoborrar/:id', auth, cTipoEquipo.getDel);
//tipo tarea
	app.get('/tipotarealista', auth, cTipoTarea.getLista);
	app.get('/tipotareaalta', auth, cTipoTarea.getAlta);
	app.post('/tipotareaalta', auth, cTipoTarea.postAlta);
	app.get('/tipotareamodificar/:id', auth, cTipoTarea.getModificar);
	app.post('/tipotareamodificar', auth, cTipoTarea.postModificar);
	app.get('/tipotareaborrar/:id', auth, cTipoTarea.getDel);
//modelo m1
	app.get('/modelomantenimientolista', auth, cModeloM1.getLista);
	app.get('/modelomantenimientoalta', auth, cModeloM1.getAlta);
	app.post('/modelomantenimientoalta', auth, cModeloM1.postAlta);
	app.get('/modelomantenimientomodificar/:id', auth, cModeloM1.getModificar);
	app.post('/modelomantenimientomodificar', auth, cModeloM1.postModificar);
	app.get('/modelomantenimientoborrar/:id', auth, cModeloM1.getDel);
//modelo m2
	app.get('/modelodetallelista/:id', auth, cModeloM2.getLista);
	app.get('/modelodetallealta/:id', auth, cModeloM2.getAlta);
	app.post('/modelodetallealta', auth, cModeloM2.postAlta);
	app.get('/modelodetallemodificar/:id', auth, cModeloM2.getModificar);
	app.post('/modelodetallemodificar', auth, cModeloM2.postModificar);
	app.get('/modelodetalleborrar/:idm1/:idm2', auth, cModeloM2.getDel);
	app.get('/modelodetallerepuestover/:id', auth, cModeloM2.getVerRepuestos);
//items de trabajo
	app.get('/itemslista', auth, cItems.getLista);
	app.get('/itemsalta', auth, cItems.getAlta);
	app.post('/itemsalta', auth, cItems.postAlta);
	app.get('/itemsmodificar/:id', auth, cItems.getModificar);
	app.post('/itemsmodificar', auth, cItems.postModificar);
	app.get('/itemsborrar/:id', auth, cItems.getDel);
//tipos de hora
	app.get('/tipohoralista', auth, cTipoHora.getLista);
	app.get('/tipohoraalta', auth, cTipoHora.getAlta);
	app.post('/tipohoraalta', auth, cTipoHora.postAlta);
	app.get('/tipohoramodificar/:id', auth, cTipoHora.getModificar);
	app.post('/tipohoramodificar', auth, cTipoHora.postModificar);
	app.get('/tipohoraborrar/:id', auth, cTipoHora.getDel);
//codigo de hora
	app.get('/codigohoralista', auth, cCodigoHora.getLista);
	app.get('/codigohoraalta', auth, cCodigoHora.getAlta);
	app.post('/codigohoraalta', auth, cCodigoHora.postAlta);
	app.get('/codigohoramodificar/:id', auth, cCodigoHora.getModificar);
	app.post('/codigohoramodificar', auth, cCodigoHora.postModificar);
	app.get('/codigohoraborrar/:id', auth, cCodigoHora.getDel);
//relojes
	app.get('/relojeslista', auth, cRelojes.getLista);
	app.get('/relojesalta', auth, cRelojes.getAlta);
	app.post('/relojesalta', auth, cRelojes.postAlta);
	app.get('/relojesmodificar/:id', auth, cRelojes.getModificar);
	app.post('/relojesmodificar', auth, cRelojes.postModificar);
	app.get('/relojesborrar/:id', auth, cRelojes.getDel);
//lugares
	app.get('/lugareslista', auth, cLugares.getLista);
	app.get('/lugaresalta', auth, cLugares.getAlta);
	app.post('/lugaresalta', auth, cLugares.postAlta);
	app.get('/lugaresmodificar/:id', auth, cLugares.getModificar);
	app.post('/lugaresmodificar', auth, cLugares.postModificar);
	app.get('/lugaresborrar/:id', auth, cLugares.getDel);
	app.get('/lugargetbysectorid/:sectorid', auth, cLugares.getBySectorId);
//clasificacion de horas
	//24/07/2015 - desde ahora "clasificacion horas " es "adicionales"
	app.get('/clasificacionlista', auth, cClasificacion.getLista);
	app.get('/clasificacionalta', auth, cClasificacion.getAlta);
	app.post('/clasificacionalta', auth, cClasificacion.postAlta);
	app.get('/clasificacionmodificar/:id', auth, cClasificacion.getModificar);
	app.post('/clasificacionmodificar', auth, cClasificacion.postModificar);
	app.get('/clasificacionborrar/:id', auth, cClasificacion.getDel);
//imputacion de horas 
	//02/07/2015-> ahora se llama ITEMS
	//los html y rutas son 'imputacion' y la base de datos es 'items'
	app.get('/imputacionlista', auth, cImputacion.getLista);
	app.get('/imputacionalta', auth, cImputacion.getAlta);
	app.post('/imputacionalta', auth, cImputacion.postAlta);
	app.get('/imputacionmodificar/:id', auth, cImputacion.getModificar);
	app.post('/imputacionmodificar', auth, cImputacion.postModificar);
	app.get('/imputacionborrar/:id', auth, cImputacion.getDel);
	app.get('/getitemsgeneralesandbysector/:sectorid', auth, cImputacion.getItems)
//parte diario 1
	app.get('/partediario1lista', auth, cParteDiario1.getLista);
	app.get('/partediario1alta', auth, cParteDiario1.getAlta);
	app.post('/partediario1alta', auth, cParteDiario1.postAlta);
	app.get('/partediario1modificar/:id', auth, cParteDiario1.getModificar);
	app.post('/partediario1modificar', auth, cParteDiario1.postModificar);
	app.get('/partediario1borrar/:id', auth, cParteDiario1.getDel);
	app.get('/partediario1close/:idpd1', auth, cParteDiario1.getClose);
	app.get('/partediario1historial', auth, cParteDiario1.getHistorial);
	app.get('/partediario1ver/:idpd1', auth, cParteDiario1.getVer);
	//para el reporte
	app.get('/itemsexport', auth, cParteDiario1.getExport);
//parte diario 2
	app.get('/partediario2lista/:id', auth, cParteDiario2.getLista);
	app.get('/partediario2alta/:id', auth, cParteDiario2.getAlta);
	app.post('/partediario2alta', auth, cParteDiario2.postAlta);
	app.get('/partediario2modificar/:id', auth, cParteDiario2.getModificar);
	app.post('/partediario2modificar', auth, cParteDiario2.postModificar);
	app.get('/partediario2borrar/:id', auth, cParteDiario2.getDel);
	app.get('/getemplesbysector/:id', auth, cParteDiario2.getEmples);
	app.get('/getempleinpd2/:idp1/:idemple', auth, cParteDiario2.getEmpleInPartediario2);
	app.get("/partediario2addall/:idp1", auth, cParteDiario2.getAddAll);
	app.post("/partediario2addall", auth, cParteDiario2.postAddAll);
//fichadas
	app.get('/fichadaslista', auth, cFichadas.getLista);
	app.get('/buscarfichadas/:fecha', auth, cFichadas.getFichadas);
	app.get('/fichadasver/:reloj/:fecha', auth, cFichadas.getVer);
	app.get('/getfichadasbyquery/:sector/:desde/:hasta/:id_emple', auth, cFichadas.getFichadasByQuery);
	app.get('/getbytarjetayfechas/:tarjeta/:fecha_hoy/:fecha_maniana', auth, cFichadas.getByTarjetayFechas);
	app.get('/fichadasporsector', auth, cFichadas.getFichadasPorSector);
	app.get('/getselectbyfechagroupbysector/:fecha', auth, cFichadas.getSelectCountByFechaGroupBySector);
	app.get('/fichadasexport/:id_sector/:fecha_desde/:fecha_hasta/:id_emple', auth, cFichadas.getFichadasExport);
//contratos
	app.get('/contratoslista', auth, cContratos.getLista);
	app.get('/contratosalta', auth, cContratos.getAlta);
	app.post('/contratosalta', auth, cContratos.postAlta);
	app.get('/contratosmodificar/:id', auth, cContratos.getModificar);
	app.post('/contratosmodificar', auth, cContratos.postModificar);
	app.get('/contratosborrar/:id', auth, cContratos.getDel);
//turnos
	app.get('/turnoslista', auth, cTurnos.getLista);
	app.get('/turnosalta', auth, cTurnos.getAlta);
	app.post('/turnosalta', auth, cTurnos.postAlta);
	app.get('/turnosmodificar/:id', auth, cTurnos.getModificar);
	app.post('/turnosmodificar', auth, cTurnos.postModificar);
	app.get('/turnosborrar/:id', auth, cTurnos.getDel);
	app.get("/getturnobysectorid/:sectorid", auth, cTurnos.getTurnosBySectorId);
//categorias
	app.get('/categoriaslista', auth, cCategorias.getLista);
	app.get('/categoriasalta', auth, cCategorias.getAlta);
	app.post('/categoriasalta', auth, cCategorias.postAlta);
	app.get('/categoriasmodificar/:id', auth, cCategorias.getModificar);
	app.post('/categoriasmodificar', auth, cCategorias.postModificar);
	app.get('/categoriasborrar/:id', auth, cCategorias.getDel);
//reportes
	app.get('/reportes', auth, cReportes.getInicio);
	app.post('/reportesinicio', auth, cReportes.postInicio);
	app.get('/itemsexport/:desde/:hasta', auth, cReportes.getItemsExport);
	app.get('/emplesexport/:desde/:hasta', auth, cReportes.getEmplesExport);
//resumen de empleado por dia
	app.get("/resumeninicio", auth, cReportes.getResumenInicio);
	app.post('/resumeninicio', auth, cReportes.postResumenInicio);
	//app.get("/resumen_callsp/:desde/:hasta/:id_emple", auth, cReportes.get_callSP);
	app.get('/resumenempleado/:id_sector/:id_emple/:desde/:hasta', auth, cReportes.getResumenEmpleado);
	app.get("/resumendownload/:id_emple/:desde/:hasta", auth, cReportes.getResumenDownload);

//plantillas
	app.get("/planti1lista", auth, cPlanti.getLista);
	app.get("/planti1alta", auth, cPlanti.getAlta);
	app.post('/planti1alta', auth, cPlanti.postAlta);
	app.get('/planti1modificar/:id_planti1', auth, cPlanti.getModificar);
	app.post('/planti1modificar', auth, cPlanti.postModificar);
	app.get('/planti1borrar/:id_planti1', auth, cPlanti.getDel);

	app.get('/planti2lista/:id_planti1', auth, cPlanti.getListap2);
	app.get('/planti2alta/:id_planti1', auth, cPlanti.getAltap2);
	app.post('/planti2alta', auth, cPlanti.postAltap2);
	app.get('/planti2borrar/:id_p2/:id_p1', auth, cPlanti.getDelp2);

//centros de costos
	app.get('/cclista', auth, cCentrosCostos.getLista);
	app.get('/ccalta', auth, cCentrosCostos.getAlta);
	app.post('/ccalta', auth, cCentrosCostos.postAlta);
	app.get('/ccmodificar/:id', auth, cCentrosCostos.getModificar);
	app.post('/ccmodificar', auth, cCentrosCostos.postModificar);
	app.get('/ccborrar/:id', auth, cCentrosCostos.getDel);
//pedidos abastecimiento
	app.get('/palista', auth, cPedidosAbastecimiento.getLista);
	app.get('/paalta', auth, cPedidosAbastecimiento.getAlta);
	app.post('/paalta', auth, cPedidosAbastecimiento.postAlta);
	app.get('/paaltaart', auth, cPedidosAbastecimiento.getAltaArt);
	app.post('/paaltaart', auth, cPedidosAbastecimiento.postAltaArt);
	app.get("/getpasfiltrado/:opcion/:desde/:hasta/:tipo_fecha", auth, cPedidosAbastecimiento.getPAsfiltrado);
	app.post("/pamarcarrevisado/:id", auth, cPedidosAbastecimiento.postMarcarRevisado);
	app.post("/pamarcaraprobado/:id/:cant", auth, cPedidosAbastecimiento.postMarcarAprobado);
	app.post("/pamarcarrechazado/:id/:motivo", auth, cPedidosAbastecimiento.postMarcarRechazado);
	app.get('/pamodificar/:id', auth, cPedidosAbastecimiento.getModificar);
	app.post('/pamodificar', auth, cPedidosAbastecimiento.postModificar);
	app.get('/paborrar/:id', auth, cPedidosAbastecimiento.getDel);
	app.get('/paprint/:nro_pa', auth, cPedidosAbastecimiento.getPrintPA);
//proveedores
	app.get('/proveedoreslista', auth, cProveedores.getLista);
	app.get('/proveedoresalta', auth, cProveedores.getAlta);
	app.post('/proveedoresalta', auth, cProveedores.postAlta);
	app.get('/proveedoresmodificar/:id', auth, cProveedores.getModificar);
	app.post('/proveedoresmodificar', auth, cProveedores.postModificar);
	app.get('/proveedoresborrar/:id', auth, cProveedores.getDel);
	app.get('/proveedoresver/:id', auth, cProveedores.getVer);
//ordenes de compra
	app.get('/ordencompra_lista_items', auth, cOrdenesCompra.getLista_items);
	app.get("/ordencompra_alta/:cant_items/:aItems", auth, cOrdenesCompra.getAlta);
	app.post("/ordencompra_alta", auth, cOrdenesCompra.postAlta);
	app.get("/ordencompra_print/:id_oc", auth, cOrdenesCompra.getPrint);
	app.get("/ordencompra_lista", auth, cOrdenesCompra.getLista);
	app.get("/filtraroc/:desde/:hasta", auth, cOrdenesCompra.getFiltrarOc);


// ETC
//pruebasql
	app.get('/pruebasql', auth, cPruebaSQL.getPrueba);
//random
	app.get('/random', auth, cRandom.getAsd);
	app.post('/random', auth, cRandom.postAsd);
	app.get('/random2', auth, cRandom.getr2);
	app.post('/random2', auth, cRandom.postr2);
	app.get('/random3', auth, cRandom.getRandom3);
	app.post('/random3', auth, cRandom.postRandom3);
	app.get('/random4', auth, cRandom.getRandom4);
	app.post('/random4', auth, cRandom.postRandom4);
	app.get('/random5', auth, cRandom.getRandom5);
	app.post('/random5', auth, cRandom.postRandom5);
	app.get('/random6', auth, cRandom.getRandom6);
	app.post('/random6', auth, cRandom.postRandom6);
}; 
