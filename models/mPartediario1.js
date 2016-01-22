var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getAllAbiertos: getAllAbiertos,
	getAllCerrados: getAllCerrados,
	insert: insert,
	getById: getById,
	update: update,
	del: del,
	getLastId: getLastId,
	closeParteDiario: closeParteDiario,
	getSP_ItemsEntreFechas: getSP_ItemsEntreFechas
}

function getAll(cb){
	//sectortxt lugartxt fechaf
	//select concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt from partediario1 left join contratos on contratos.id = partediario1.id_contrato_fk
	conn("select partediario1.*, DATE_FORMAT(partediario1.fecha, '%d/%m/%Y') as fechaf, lugares.nombre as lugartxt, "+
		"sectores.nombre as sectortxt, "+
		"turnos.codigo as turnotxt, "+
		"concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt "+
		"from partediario1 "+
		"left join lugares on lugares.id = partediario1.id_lugar_fk "+
		"left join sectores on sectores.id = partediario1.id_sector_fk "+
		"left join turnos on turnos.id = partediario1.id_turno_fk "+
		"left join contratos on contratos.id = partediario1.id_contrato_fk", cb);
}

function getAllAbiertos(cb){
	//sectortxt lugartxt fechaf
	//select concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt from partediario1 left join contratos on contratos.id = partediario1.id_contrato_fk
	conn("select partediario1.*, DATE_FORMAT(partediario1.fecha, '%d/%m/%Y') as fechaf, lugares.nombre as lugartxt, "+
		"sectores.nombre as sectortxt, "+
		"turnos.codigo as turnotxt, "+
		"concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt "+
		"from partediario1 "+
		"left join lugares on lugares.id = partediario1.id_lugar_fk "+
		"left join sectores on sectores.id = partediario1.id_sector_fk "+
		"left join turnos on turnos.id = partediario1.id_turno_fk "+
		"left join contratos on contratos.id = partediario1.id_contrato_fk "+
		"where partediario1.estado = 1 order by fecha desc, id desc", cb);
}

function getAllCerrados(cb){
	//sectortxt lugartxt fechaf
	//select concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt from partediario1 left join contratos on contratos.id = partediario1.id_contrato_fk
	conn("select partediario1.*, DATE_FORMAT(partediario1.fecha, '%d/%m/%Y') as fechaf, "+
		"lugares.nombre as lugartxt, "+
		"sectores.nombre as sectortxt, "+
		"turnos.codigo as turnotxt, "+
		"concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt "+
		"from partediario1 "+
		"left join lugares on lugares.id = partediario1.id_lugar_fk "+
		"left join sectores on sectores.id = partediario1.id_sector_fk "+
		"left join turnos on turnos.id = partediario1.id_turno_fk "+
		"left join contratos on contratos.id = partediario1.id_contrato_fk "+
		"where partediario1.estado = 0", cb);
}

function insert(fecha, contrato, idsector, idlugar, turno, estado, clasificacion1, clasificacion2, clasificacion3, clasificacion4, clasificacion5, clasificacion6, imputacion1, imputacion2, imputacion3, imputacion4, imputacion5, imputacion6, imputacion7, imputacion8, imputacion9, imputacion10, imputacion11, imputacion12, cb){
	conn("INSERT INTO `partediario1`(`fecha`, id_contrato_fk, `id_sector_fk`, `id_lugar_fk`, id_turno_fk, `estado`, `id_clasificacion1_fk`, "+
		"`id_clasificacion2_fk`, `id_clasificacion3_fk`, `id_clasificacion4_fk`, `id_clasificacion5_fk`, `id_clasificacion6_fk`, "+
		"`id_imputacion1_fk`, `id_imputacion2_fk`, `id_imputacion3_fk`, `id_imputacion4_fk`, `id_imputacion5_fk`, `id_imputacion6_fk`, "+
		"`id_imputacion7_fk`, `id_imputacion8_fk`, `id_imputacion9_fk`, `id_imputacion10_fk`, `id_imputacion11_fk`, `id_imputacion12_fk`) "+
		"VALUES ('"+fecha+"',"+contrato+", "+idsector+", "+ idlugar +", "+turno+", 1, "+clasificacion1+", "+clasificacion2+
		", "+clasificacion3+", "+clasificacion4+", "+clasificacion5+", "+clasificacion6+", "+imputacion1+", "+imputacion2+
		", "+imputacion3+", "+imputacion4+", "+imputacion5+", "+imputacion6+", "+imputacion7+", "+imputacion8+", "+imputacion9+ 
		", "+imputacion10+", "+imputacion11+", "+imputacion12+")", cb);
}

function getById(id, cb){
	conn("select partediario1.*, DATE_FORMAT(partediario1.fecha, '%d/%m/%Y') as fechaf, "+
		"(select nombre from clasificacion_hora where clasificacion_hora.id = partediario1.id_clasificacion1_fk) as clasificacion1txt, "+
		"(select nombre from clasificacion_hora where clasificacion_hora.id = partediario1.id_clasificacion2_fk) as clasificacion2txt, "+
		"(select nombre from clasificacion_hora where clasificacion_hora.id = partediario1.id_clasificacion3_fk) as clasificacion3txt, "+
		"(select nombre from clasificacion_hora where clasificacion_hora.id = partediario1.id_clasificacion4_fk) as clasificacion4txt, "+
		"(select nombre from clasificacion_hora where clasificacion_hora.id = partediario1.id_clasificacion5_fk) as clasificacion5txt, "+
		"(select nombre from clasificacion_hora where clasificacion_hora.id = partediario1.id_clasificacion6_fk) as clasificacion6txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion1_fk) as imputacion1txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion2_fk) as imputacion2txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion3_fk) as imputacion3txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion4_fk) as imputacion4txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion5_fk) as imputacion5txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion6_fk) as imputacion6txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion7_fk) as imputacion7txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion8_fk) as imputacion8txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion9_fk) as imputacion9txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion10_fk) as imputacion10txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion11_fk) as imputacion11txt, "+
		"(select numero from items where items.id = partediario1.id_imputacion12_fk) as imputacion12txt, "+
		"DATE_FORMAT(partediario1.fecha, '%d/%m/%Y') as fechaf, "+
		"lugares.nombre as lugartxt, sectores.nombre as sectortxt, "+
		"turnos.codigo as turnotxt, concat_ws(' ', contratos.nombre, contratos.numero) as contratotxt "+
		"from partediario1 "+
		"left join lugares on lugares.id = partediario1.id_lugar_fk "+
		"left join sectores on sectores.id = partediario1.id_sector_fk "+
		"left join turnos on turnos.id = partediario1.id_turno_fk "+
		"left join contratos on contratos.id = partediario1.id_contrato_fk "+
		"where partediario1.id="+id, cb);
}

function update(id, fecha, contrato, idsector, idlugar, turno, estado, clasificacion1, clasificacion2, clasificacion3, clasificacion4, clasificacion5, clasificacion6, imputacion1, imputacion2, imputacion3, imputacion4, imputacion5, imputacion6, imputacion7, imputacion8, imputacion9, imputacion10, imputacion11, imputacion12, cb){
	conn("UPDATE `partediario1` SET `fecha`='"+fecha+"', id_contrato_fk="+contrato+", `id_sector_fk`="+idsector+",`id_lugar_fk`="+idlugar+", "+
		"id_turno_fk="+turno+", `estado`="+estado+",`id_clasificacion1_fk`="+clasificacion1+",`id_clasificacion2_fk`="+clasificacion2+", "+
		"`id_clasificacion3_fk`="+clasificacion3+", `id_clasificacion4_fk`="+clasificacion4+", `id_clasificacion5_fk`="+clasificacion5+", "+
		"`id_clasificacion6_fk`="+clasificacion6+", `id_imputacion1_fk`="+imputacion1+", `id_imputacion2_fk`="+imputacion2+", "+
		"`id_imputacion3_fk`="+imputacion3+", `id_imputacion4_fk`="+imputacion4+", `id_imputacion5_fk`="+imputacion5+", "+
		"`id_imputacion6_fk`="+imputacion6+", `id_imputacion7_fk`="+imputacion7+", `id_imputacion8_fk`="+imputacion8+", "+
		"`id_imputacion9_fk`="+imputacion9+", "+"`id_imputacion10_fk`="+imputacion10+", "+"`id_imputacion11_fk`="+imputacion11+", "+
		"`id_imputacion12_fk`="+imputacion12+" "+
		"WHERE id ="+id, cb);
}

function del(id, cb){
	conn("delete from partediario1 where partediario1.id="+id, cb);
}

//para el partediario1 alta
function getLastId(cb){
	conn("select max(id) as id from partediario1", cb)
}

function closeParteDiario(idp1, cb){
	// 1 = abierto
	// 0 = cerrado
	conn("update partediario1 set estado = 0 where partediario1.id = "+idp1, cb);
}

// Pal reporte 
	function getSP_ItemsEntreFechas(fecha_desde, fecha_hasta, cb){
		conn("call itemsEntreFechas('"+fecha_desde+"', '"+fecha_hasta+"')", cb);
	}