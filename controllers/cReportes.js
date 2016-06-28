//requerimientos de modelo
mItems = require('../models/mItems');
mParteDiario1 = require('../models/mParteDiario1');
mParteDiario2 = require('../models/mParteDiario2');
mEmple = require('../models/mEmple');
mSectores = require('../models/mSectores');

var async = require('async');
var mysql = require('mysql');
var nodeExcel = require('excel-export');

module.exports = {
	getInicio: getInicio,
	postInicio: postInicio,
	getItemsExport: getItemsExport,
	getEmplesExport: getEmplesExport,
	getResumenInicio: getResumenInicio,
	postResumenInicio: postResumenInicio,
	get_callSP: get_callSP,
	getResumenEmpleado: getResumenEmpleado,
	getResumenDownload: getResumenDownload
}

function changeDate(date){
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
	return fechaus;
	// output: yyyy/mm/dd
}

function getInicio(req, res){
	res.render('reportesinicio', {
		pagename: 'Elija el tipo de reporte'
	});
}

function postInicio(req, res){
	params = req.body;
	tiporeporte = params.tiporeporte;
	fechadesde = params.fechadesde;
	fechahasta = params.fechahasta;

	fecha_desde = changeDate(fechadesde);
	fecha_hasta = changeDate(fechahasta);

	if (tiporeporte == 1){
	//render reporte para items
		
		mParteDiario1.getSP_ItemsEntreFechas(fecha_desde, fecha_hasta, function (items){
			cantidad = items[0].length;
			res.render("reportesitems", {
				pagename: "Reporte de items",
				items: items[0],
				fechadesde: fechadesde,
				fechahasta: fechahasta,
				cantidad: cantidad
			});
		});
	} else if (tiporeporte == 2){
	//render reporte para empleados
		mEmple.getSP_EmplesEntreFechas(fecha_desde, fecha_hasta, function (emples){
			console.log(emples.length)
			cantidad = emples[0].length;
			res.render("reportesemple", {
				pagename: "Reporte de Empleados",
				emples: emples[0],
				fechadesde: fechadesde,
				fechahasta: fechahasta,
				cantidad: cantidad
			});
		});
	}else{
		//error
	}
}

function getItemsExport(req, res){
	console.log("go!")
	//var cellData = "Give me something to believe";
	params = req.params;
	fecha_desde = params.desde;
	fecha_hasta = params.hasta;

	mParteDiario1.getSP_ItemsEntreFechas(fecha_desde, fecha_hasta, function (items){
		//console.log(items[0])
		items = items[0];
		//console.log(items)
		var conf = {};
			//este tiene una url acá pero en el server es otra....
			// conf.stylesXmlFile = "C:/Users/leandro/Documents/Maresa-master/style.xml";
				conf.stylesXmlFile = "D:/Proyectos/Maresa/style.xml";
		/*ITEM	
		DESCRIPCION	
		HS NORMALES	
		HS al 50	
		HS al 100	
		HS TOTALES*/
	    conf.cols = [{caption:'Item', type:'number'},
	    {caption:'Descripcion', type:'string'},
	    {caption:'Hrs Normales', type:'number'},
	    {caption:'Hrs al 50', type:'number'},
	    {caption:'Hrs al 100', type:'number'},
	    {caption:'Total', type:'number'}];
	
		var arrItems = [];

		for (var x = 0 ; x < items.length ; x++){
	    	item = items[x].itemnum;
	    	descripcion = items[x].itemtxt;
	    	normales = items[x].normal;
	    	hrs50 = items[x].Al50;
	    	hrs100 = items[x].Al100;
	    	hrstotales = items[x].Total;
	    	
	    	var items2 = [];

	    	items2.push(item);
	    	items2.push(descripcion);
	    	items2.push(normales);
	    	items2.push(hrs50);
	    	items2.push(hrs100);
	    	items2.push(hrstotales);

	    	arrItems.push(items2);
	    }

	   	conf.rows = arrItems;
	    var result = nodeExcel.execute(conf);
	    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	    res.setHeader("Content-Disposition", "attachment; filename=" + "ReporteItems.xlsx");
	    res.end(result, 'binary');
	});
	
    
    console.log("finished")
}

function getEmplesExport(req, res){
	console.log("go!")
	//var cellData = "Give me something to believe";
	params = req.params;
	fecha_desde = params.desde;
	fecha_hasta = params.hasta;

	mEmple.getSP_EmplesEntreFechas(fecha_desde, fecha_hasta, function (emples){
		//console.log(emples[0])
		emples = emples[0];
		//console.log(items)
		var conf = {};
			//este tiene una url acá pero en el server es otra....
			// conf.stylesXmlFile = "C:/Users/leandro/Documents/Maresa-master/style.xml";
			conf.stylesXmlFile = "D:/Proyectos/Maresa/style.xml";
	    conf.cols = [{caption:'Legajo', type:'number'},
		    {caption:'Nombre', type:'string'},
		    {caption:'Sector', type:'string'},
		    {caption:'Categoria', type:'string'},
		    {caption:'Hrs Normales', type:'number'},
		    {caption:'Hrs al 50', type:'number'},
		    {caption:'Hrs al 100', type:'number'},
		    {caption:'Feriados Trabajado', type:'number'},
		    {caption:'Feriados No Trabajado', type:'number'},
			{caption:'Hrs Nocturnas Normales', type:'number'},
		    {caption:'Hrs Nocturnas al 100', type:'number'},
		    {caption:'Hrs Nocturnas Feriado', type:'number'},
			{caption:'Hrs Calorias Normales', type:'number'},
		    {caption:'Hrs Calorias al 50', type:'number'},
		    {caption:'Hrs Calorias al 100', type:'number'},
		    {caption:'Hrs Calorias Feriado', type:'number'},
 			{caption:'Hrs Insalubres Normales', type:'number'},
		    {caption:'Hrs Insalubres al 50', type:'number'},
		    {caption:'Hrs Insalubres al 100', type:'number'},
		    {caption:'Hrs Insalubres Feriado', type:'number'},
			{caption:'Hrs Peligrosas Normales', type:'number'},
		    {caption:'Hrs Peligrosas al 50', type:'number'},
		    {caption:'Hrs Peligrosas al 100', type:'number'},
		    {caption:'Hrs Peligrosas Feriado', type:'number'},
		    {caption:'Hrs Polucion Normales', type:'number'},
		    {caption:'Hrs Termo Normales', type:'number'},
		    {caption:'Emergencias', type:'number'},//ADICIONAL emerg
		    {caption:'Presentismo', type:'number'}, //va vacio
		   	{caption:'Hrs Reconocimiento', type:'number'},//HS. 'HS' SE REFIERE AL PAGO DE HS. POR RECONOCIMIENTO, COD. 22-
		   	{caption:'Enfermedades', type:'number'},
		   	{caption:'Compensatorios', type:'number'},		   	
		   	{caption:'Hrs Rec. por Diagrama', type:'number'},// reconocimiento - RECONOCIMIENTO POR CAMBIO DE DIAGRAMA EN EL TURNO, COD. 23
		   	{caption:'Adic. Taller', type:'number'}, //va vacio
		   	{caption:'Permisos Gremiales', type:'number'},
		   	{caption:'Hrs Donacion Sangre', type:'number'},
			{caption:'Hrs Familiar Enfermo', type:'number'},
			{caption:'Hrs Citacion Judicial', type:'number'},
			{caption:'Hrs Lic. Fallecimiento', type:'number'},
			{caption:'Hrs Lic. Nacimiento', type:'number'},
			{caption:'Hrs Lic. Examen', type:'number'},
			{caption:'Hrs Lic. Accidente', type:'number'},
			{caption:'Hrs Lic. Mudanza', type:'number'},
			{caption:'Hrs Lic. Matrimonio', type:'number'},
			{caption:'Hrs Lic. Inundacion', type:'number'},
			{caption:'Hrs Examen Medico', type:'number'},
			{caption:'Prestacion', type:'number'}, //va vacio
			{caption:'Turnicidad', type:'number'},
			{caption:'Jornada', type:'number'}, //va vacio
			{caption:'Guardias', type:'number'}, //va vacio
			{caption:'Titulo', type:'number'}, //va vacio
			{caption:'Ret. Farmacia', type:'number'}, //va vacio
			{caption:'Colecta solidaria', type:'number'}, //va vacio
			{caption:'Descuentos', type:'number'}, //va vacio
			{caption:'Observaciones', type:'text'}, //va vacio
		    // {caption:'Hrs Capacitacion', type:'number'},
			];//53
	
		var arrEmples = [];

		for (var x = 0 ; x < emples.length ; x++){
	    	legajo = emples[x].legajo;
			empletxt = emples[x].empletxt;
			sectortxt = emples[x].sectortxt;
			categoriatxt = emples[x].categoriatxt;
			hrs_normales = emples[x].hrs_normales;
			hrs_al50 = emples[x].hrs_al50;
			hrs_al100 = emples[x].hrs_al100;
			hrs_feriado_trabajado = emples[x].hrs_feriado_trabajado;
			hrs_feriado_no_trabajado = emples[x].hrs_feriado_no_trabajado;
			hrs_nocturnas_normales = emples[x].hrs_nocturnas_normales;				
			hrs_nocturnas_100 = emples[x].hrs_nocturnas_100;
			hrs_nocturnas_feriado = emples[x].hrs_nocturnas_feriado;
			calorias_n = emples[x].calorias_n;
			calorias_50 = emples[x].calorias_50;
			calorias_100 = emples[x].calorias_100;
			calorias_fer = emples[x].calorias_fer;
 			insalubres_n = emples[x].insalubres_n;
			insalubres_50 = emples[x].insalubres_50;
			insalubres_100 = emples[x].insalubres_100;
			insalubres_fer = emples[x].insalubres_fer;
			peligrosas_n = emples[x].peligrosas_n;
			peligrosas_50 = emples[x].peligrosas_50;
			peligrosas_100 = emples[x].peligrosas_100;
			peligrosas_fer = emples[x].peligrosas_fer;
		 	polucion_n = emples[x].polucion_n;
		 	termo_n = emples[x].termo_n;
		 	emergencias = emples[x].emergencias; //ADICIONAL emerg		 	
		 	presentismo = ''; //va vacio
		 	horas_reconocimiento = emples[x].horas_reconocimiento;	// cod 22
		 	enfermedad = emples[x].enfermedad;
			compensatorio = emples[x].compensatorio;
		 	hrs_reconocimiento = emples[x].hrs_reconocimiento;//HS. cod 23		 	
		 	adicional_taller = '';// {caption:'Adic. Taller', type:'number'}, //va vacio
			permiso_gremial = emples[x].permiso_gremial;
			donacion_sangre = emples[x].donacion_sangre;
			familiar_enfermo = emples[x].familiar_enfermo;
			citacion_judicial = emples[x].citacion_judicial;
			lic_fallecimiento = emples[x].lic_fallecimiento;
			lic_nacimiento = emples[x].lic_nacimiento;
			lic_examen = emples[x].lic_examen;
			lic_accidente = emples[x].lic_accidente;
			lic_mudanza = emples[x].lic_mudanza;
			lic_matrimonio = emples[x].lic_matrimonio;
			lic_inundacion = emples[x].lic_inundacion;
			examen_medico = emples[x].examen_medico;			
			prestacion = ''; // {caption:'Prestacion', type:'number'}, //va vacio			
			turnicidad = emples[x].turnicidad; // {caption:'Turnicidad', type:'number'},			
			jornada = ''; // {caption:'Jornada', type:'number'}, //va vacio			
			guardias = ''; // {caption:'Guardias', type:'number'}, //va vacio			
			titulo = ''; // {caption:'Titulo', type:'number'}, //va vacio			
			ret_farmacia = ''; // {caption:'Ret. Farmacia', type:'number'}, //va vacio			
			colecta_solidaria = ''; // {caption:'Colecta solidaria', type:'number'}, //va vacio			
			descuentos = '';// {caption:'Descuentos', type:'number'}, //va vacio
			observaciones = '';
	    	//53
	    	var emples2 = [];

	    	emples2.push(legajo);
	    	emples2.push(empletxt);
	    	emples2.push(sectortxt);
	    	emples2.push(categoriatxt);
	    	emples2.push(hrs_normales);
	    	emples2.push(hrs_al50);
	    	emples2.push(hrs_al100);
	    	emples2.push(hrs_feriado_trabajado);
	    	emples2.push(hrs_feriado_no_trabajado);
	    	emples2.push(hrs_nocturnas_normales);
			emples2.push(hrs_nocturnas_100);
			emples2.push(hrs_nocturnas_feriado);
			emples2.push(calorias_n);
			emples2.push(calorias_50);
			emples2.push(calorias_100);
			emples2.push(calorias_fer);
 			emples2.push(insalubres_n);
			emples2.push(insalubres_50);
			emples2.push(insalubres_100);
			emples2.push(insalubres_fer);
			emples2.push(peligrosas_n);
			emples2.push(peligrosas_50);
			emples2.push(peligrosas_100);
			emples2.push(peligrosas_fer);
		 	emples2.push(polucion_n);
		 	emples2.push(termo_n);
			emples2.push(emergencias);
		 	emples2.push(presentismo);
		 	emples2.push(horas_reconocimiento);
		 	emples2.push(enfermedad);
			emples2.push(compensatorio);
			emples2.push(hrs_reconocimiento);
		 	emples2.push(adicional_taller);
			emples2.push(permiso_gremial);
			emples2.push(donacion_sangre);
			emples2.push(familiar_enfermo);
			emples2.push(citacion_judicial);
			emples2.push(lic_fallecimiento);
			emples2.push(lic_nacimiento);
			emples2.push(lic_examen);
			emples2.push(lic_accidente);
			emples2.push(lic_mudanza);
			emples2.push(lic_matrimonio);
			emples2.push(lic_inundacion);
			emples2.push(examen_medico);
			emples2.push(prestacion);
			emples2.push(turnicidad);
			emples2.push(jornada);
			emples2.push(guardias);
			emples2.push(titulo);
			emples2.push(ret_farmacia);
			emples2.push(colecta_solidaria);
			emples2.push(descuentos);
			emples2.push(observaciones);
			//53

	    	arrEmples.push(emples2);
	    }

	   	conf.rows = arrEmples;
	    var result = nodeExcel.execute(conf);
	    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	    res.setHeader("Content-Disposition", "attachment; filename=" + "ReporteEmpleados.xlsx");
	    res.end(result, 'binary');
	});
	
    console.log("finished");
}

function getResumenInicio(req, res){
	mSectores.getAll(function (sectores){
		res.render('resumeninicio', {
			pagename: 'Selecccione el rango de fechas y el sector',
			sectores: sectores
		});
	});
}

function postResumenInicio(req, res){
	params = req.body;
	fecha_desde = params.fechadesde;
	fecha_hasta = params.fechahasta;
	id_sector = params.sector;
	
	fechadesde = changeDate(fecha_desde);
	fechahasta = changeDate(fecha_hasta);

	if (id_sector != 0){
		mEmple.getEmpleBySector(id_sector, function (emplesxsector){
			//console.log(emplesxsector.length);
			res.render("resumenlista", {
				pagename: "Lista de Empleados",
				emplesxsector: emplesxsector,
				desde: fecha_desde,
				hasta: fecha_hasta,
				id_sector: id_sector
			});
		});
	}else{
		//aca render si es "todos los empleados"
		mEmple.getAllActivos(function (emplesactivos){
			res.render("resumenlista", {
				pagename: "Lista de Empleados",
				emplesxsector: emplesactivos,
				desde: fecha_desde,
				hasta: fecha_hasta,
				id_sector: id_sector
			});
		});
	}
}

function get_callSP(req, res){
	params = req.params;
	desde = params.desde;
	hasta = params.hasta;
	id_emple = params.id_emple;

	mEmple.getSP_diasPorEmpleado(desde, hasta, id_emple, function (diasporempleado){
		res.send(diasporempleado)
	});
}

function getResumenEmpleado(req, res){
	params = req.params;
	desde = params.desde;
	hasta = params.hasta;
	id_emple = params.id_emple;
	id_sector = params.id_sector;
	var index_en_obj_actual = 0;
	var next_id = 0;
	console.log("id_emple (p): "+id_emple)

	if (id_sector != 0){
		mEmple.getEmpleBySector(id_sector, function (emplesxsector){
			for (var i = 0 ; i <= emplesxsector.length ; i++) {
				if (id_emple == emplesxsector[i].codigo){
					if (i == emplesxsector.length-1)
						next_id = 0;
					else
						next_id = emplesxsector[i+1].codigo;
					break;	
				}else{
					next_id = 0;
				}
			}
		});			
	}else{
		mEmple.getAllActivos(function (emplesactivos){
			for (var i = 0 ; i <= emplesactivos.length ; i++) {
				if (id_emple == emplesactivos[i].codigo){
					if (i == emplesactivos.length-1)
						next_id = 0;
					else
						next_id = emplesactivos[i+1].codigo;
					break;	
				}else{
					next_id = 0;
				}
			}
		});
	}

	//console.log("proximo id (c): "+next_id);
	mEmple.getSP_diasPorEmpleado(desde, hasta, id_emple, function (diasporempleado){
		mEmple.getEmplePorCodigo(id_emple, function (emple){
			mEmple.getSP_sumatoriasDiasPorEmpleado(desde, hasta, id_emple, function (sumatorias){
				res.render("resumenempleado", {
					pagename: "Resumen de Empleado",
					diasporempleado: diasporempleado[0],
					emple: emple[0],
					sumatorias: sumatorias[0][0],
					next_id: next_id,
					index: index_en_obj_actual,
					desde: desde,
					hasta: hasta
				});
			});
		});
	});
}

function getResumenDownload(req, res){
	params = req.params;
	fecha_desde = params.desde;
	fecha_hasta = params.hasta;
	id_emple = params.id_emple;

	mEmple.getEmplePorCodigo(id_emple, function (emple){
		//console.log(emple[0])
		legajo = emple[0].legajo;
		nombre = emple[0].nombre;
		sector = emple[0].sectortxt;
		mEmple.getSP_diasPorEmpleado(fecha_desde, fecha_hasta, id_emple, function (emples){
			//console.log(emples[0])
			emples = emples[0];
			//console.log(items)
			var conf = {};
			//este tiene una url acá pero en el server es otra....
			// conf.stylesXmlFile = "C:/Users/leandro/Documents/Maresa-master/style.xml";
			conf.stylesXmlFile = "D:/Proyectos/Maresa/style.xml";

		    conf.cols = [{caption:'Fecha', type:'string'},
		    	{caption:'Dia', type:'string'},
			    {caption:'Codigo de Hora', type:'string'},
			    {caption:'Hrs Normal', type:'number'},
			    {caption:'Hrs 50', type:'number'},
			    {caption:'Hrs 100', type:'number'},
			    {caption:'CAL Norm.', type:'number'},
			    {caption:'CAL 50', type:'number'},
			    {caption:'CAL 100', type:'number'},
			    {caption:'CAL F', type:'number'},
			    {caption:'INSA Norm.', type:'number'},
			    {caption:'INSA 50', type:'number'},
			    {caption:'INSA 100', type:'number'},
			    {caption:'INSA F.', type:'number'},
				{caption:'PEL Norm.', type:'number'},
				{caption:'PEL 50', type:'number'},
				{caption:'PEL 100', type:'number'},
				{caption:'PEL F', type:'number'},
				{caption:'POL Norm.', type:'number'},
				{caption:'TERMO Norm.', type:'number'},
				{caption:'NOC Norm.', type:'number'},
				{caption:'NOC 100.', type:'number'},
				{caption:'NOC F', type:'number'},
				{caption:'Ausentismo', type:'number'},
				{caption:'Capacitacion', type:'number'},
				{caption:'Cit. Jud.', type:'number'},
			    {caption:'Comp.', type:'number'},
			    {caption:'Don. Sang.', type:'number'},
			    {caption:'Emer.', type:'number'},
			    {caption:'Enf.', type:'number'},
			    {caption:'Ex. Med.', type:'number'},
			    {caption:'Fam. Enf.', type:'number'},
			    {caption:'Hrs Rec.', type:'number'},
			    {caption:'Fer. Trab.', type:'number'},
			    {caption:'Fer. No_Trab.', type:'number'},
			    {caption:'Hrs Rec. Diag.', type:'number'},
			    {caption:'Lic. Acc.', type:'number'},
			    {caption:'Lic. Ex.', type:'number'},
			    {caption:'Lic. Fall.', type:'number'},
			    {caption:'Lic. Inun.', type:'number'},
			    {caption:'Lic. Mat.', type:'number'},
			    {caption:'Lic. Mud.', type:'number'},
			    {caption:'Lic. Nac.', type:'number'},
			    {caption:'Perm. Grem.', type:'number'},
				{caption:'Turnicidad', type:'number'}];

			var arrEmples = [];

			for (var x = 0 ; x < emples.length ; x++){

				var fechaf = emples[x].fechaf;
				var dia = emples[x].dia;
				var codigohoratxt = emples[x].codigohoratxt;
				var Normal = emples[x].Normal;
				var Al50 = emples[x].Al50;
				var Al100 = emples[x].Al100;
				var calorias_n = emples[x].calorias_n;			
				var calorias_50 = emples[x].calorias_50;
				var calorias_100 = emples[x].calorias_100;
				var calorias_fer = emples[x].calorias_fer;
				var insalubres_n = emples[x].insalubres_n;
				var insalubres_50 = emples[x].insalubres_50;
				var insalubres_100 = emples[x].insalubres_100;
				var insalubres_fer = emples[x].insalubres_fer;
				var peligrosas_n = emples[x].peligrosas_n;
				var peligrosas_50 = emples[x].peligrosas_50;
				var peligrosas_100 = emples[x].peligrosas_100;
				var peligrosas_fer = emples[x].peligrosas_fer;
				var polucion_n = emples[x].polucion_n;
				var termo_n = emples[x].termo_n;
				var hrs_nocturnas_normales = emples[x].hrs_nocturnas_normales;
				var hrs_nocturnas_100 = emples[x].hrs_nocturnas_100;
				var hrs_nocturnas_feriado = emples[x].hrs_nocturnas_feriado;
				var ausentismo = emples[x].ausentismo;
				var capacitacion = emples[x].capacitacion;
				var citacion_judicial = emples[x].citacion_judicial;
				var compensatorio = emples[x].compensatorio;
				var donacion_sangre = emples[x].donacion_sangre;
				var emergencias = emples[x].emergencias;
				var enfermedad = emples[x].enfermedad;
				var examen_medico = emples[x].examen_medico;
				var familiar_enfermo = emples[x].familiar_enfermo;
				var horas_reconocimiento = emples[x].horas_reconocimiento;
				var hrs_feriado_trabajado = emples[x].hrs_feriado_trabajado;
				var hrs_feriado_no_trabajado = emples[x].hrs_feriado_no_trabajado;									
				var hrs_reconocimiento_diagrama = emples[x].hrs_reconocimiento_diagrama;
				var lic_accidente = emples[x].lic_accidente;
				var lic_examen = emples[x].lic_examen;
				var lic_fallecimiento = emples[x].lic_fallecimiento;
				var lic_inundacion = emples[x].lic_inundacion;
				var lic_matrimonio = emples[x].lic_matrimonio;
				var lic_mudanza = emples[x].lic_mudanza;
				var lic_nacimiento = emples[x].lic_nacimiento;			
				var permiso_gremial = emples[x].permiso_gremial;
				var turnicidad = emples[x].turnicidad;	    	
		    	
		    	var emples2 = [];

		    	emples2.push(fechaf);
		    	emples2.push(dia);
		    	emples2.push(codigohoratxt);
		    	emples2.push(Normal);
		    	emples2.push(Al50);
		    	emples2.push(Al100);
		    	emples2.push(calorias_n);
		    	emples2.push(calorias_50);
		    	emples2.push(calorias_100);
		    	emples2.push(calorias_fer);
		    	emples2.push(insalubres_n);
		    	emples2.push(insalubres_50);
		    	emples2.push(insalubres_100);
		    	emples2.push(insalubres_fer);
		    	emples2.push(peligrosas_n);
		    	emples2.push(peligrosas_50);
		    	emples2.push(peligrosas_100);
		    	emples2.push(peligrosas_fer);
		    	emples2.push(polucion_n);
		    	emples2.push(polucion_fer);
		    	emples2.push(termo_n);
		    	// emples2.push(termo_fer);
		    	emples2.push(hrs_nocturnas_normales);
		    	emples2.push(hrs_nocturnas_100);
		    	emples2.push(hrs_nocturnas_feriado);
		    	emples2.push(ausentismo);
		    	emples2.push(capacitacion);
		    	emples2.push(citacion_judicial);
		    	emples2.push(compensatorio);
		    	emples2.push(donacion_sangre);
		    	emples2.push(emergencias);
		    	emples2.push(enfermedad);
		    	emples2.push(examen_medico);
		    	emples2.push(familiar_enfermo);
		    	emples2.push(horas_reconocimiento);
		    	emples2.push(hrs_feriado_trabajado);
		    	emples2.push(hrs_feriado_no_trabajado);
		    	emples2.push(hrs_reconocimiento_diagrama);
		    	emples2.push(lic_accidente);
		    	emples2.push(lic_examen);
		    	emples2.push(lic_fallecimiento);
		    	emples2.push(lic_inundacion);
		    	emples2.push(lic_matrimonio);
		    	emples2.push(lic_mudanza);
		    	emples2.push(lic_nacimiento);
		    	emples2.push(permiso_gremial);
		    	emples2.push(turnicidad);

		    	arrEmples.push(emples2);
		    }

		    mEmple.getSP_sumatoriasDiasPorEmpleado(fecha_desde, fecha_hasta, id_emple, function (sumatorias){
		    	var emples2 = [];
		    	sumatorias = sumatorias[0][0];
		    	console.log(emples2)
		    	emples2.push('');
		    	emples2.push('');
		    	emples2.push('Totales');
		    	emples2.push(sumatorias.sum_Normal);
				emples2.push(sumatorias.sum_Al50);
				emples2.push(sumatorias.sum_Al100);
				emples2.push(sumatorias.sum_Cal_Normal);						
				emples2.push(sumatorias.sum_Cal_50);
				emples2.push(sumatorias.sum_Cal_100);
				emples2.push(sumatorias.sum_Cal_Feriado);
				emples2.push(sumatorias.sum_Insa_Normal);
				emples2.push(sumatorias.sum_Insa_50);
				emples2.push(sumatorias.sum_Insa_100);
				emples2.push(sumatorias.sum_Insa_Feriado);
				emples2.push(sumatorias.sum_Pel_Normal);
				emples2.push(sumatorias.sum_Pel_50);
				emples2.push(sumatorias.sum_Pel_100);
				emples2.push(sumatorias.sum_Pel_Feriado);
				emples2.push(sumatorias.sum_Pol_Normal);
				emples2.push(sumatorias.sum_Pol_Feriado);
				emples2.push(sumatorias.sum_Termo_Normal);
				// emples2.push(sumatorias.sum_Termo_Feriado);
				emples2.push(sumatorias.sum_Noc_N);
				emples2.push(sumatorias.sum_Noc_100);
				emples2.push(sumatorias.sum_Noc_f);
				emples2.push(sumatorias.sum_ausentismo);
				emples2.push(sumatorias.sum_capacitacion);
				emples2.push(sumatorias.sum_citacion_judicial);
				emples2.push(sumatorias.sum_compensatorio);
				emples2.push(sumatorias.sum_donacion_sangre);
				emples2.push(sumatorias.sum_emergencias);
				emples2.push(sumatorias.sum_enfermedad);
				emples2.push(sumatorias.sum_examen_medico);
				emples2.push(sumatorias.sum_familiar_enfermo);
				emples2.push(sumatorias.sum_horas_reconocimiento);
				emples2.push(sumatorias.sum_FerTrab);
				emples2.push(sumatorias.sum_FerNoTrab);												
				emples2.push(sumatorias.sum_Hrs_Rec_por_Diag);	
				emples2.push(sumatorias.sum_lic_accidente);
				emples2.push(sumatorias.sum_lic_examen);
				emples2.push(sumatorias.sum_lic_fallecimiento);
				emples2.push(sumatorias.sum_lic_inundacion);
				emples2.push(sumatorias.sum_lic_matrimonio);
				emples2.push(sumatorias.sum_lic_mudanza);
				emples2.push(sumatorias.sum_lic_nacimiento);						
				emples2.push(sumatorias.sum_permiso_gremial);	
				emples2.push(sumatorias.sum_turnicidad);
				console.log(emples2)
				arrEmples.push(emples2);
				console.log("pushed")

				//una linea a emples2 (con .push de los totales)
			    //un .push mas a arrEmples, con emples2
			   	conf.rows = arrEmples;
			    var result = nodeExcel.execute(conf);
			    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			    res.setHeader("Content-Disposition", "attachment; filename=" + "Resumen_Diario_"+legajo+"_"+nombre.trim()+"_"+sector+".xlsx");
			    res.end(result, 'binary');
		    });	    

		    
		});
	});
}