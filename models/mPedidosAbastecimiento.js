var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getUltimoCodigo: getUltimoCodigo,
	getLastNroPa: getLastNroPa,
	getPAsfiltrados: getPAsfiltrados,
	postMarcarRevisado: postMarcarRevisado,
	postMarcarAprobado: postMarcarAprobado,
	postMarcarRechazado: postMarcarRechazado,
	getItemById: getItemById,
	update: update,
	del: del
}

function getAll(cb){
	conn('select * from pedidos_abastecimiento', cb);
}

function getUltimoCodigo(cb){
	conn("select max(nro_pa) as nro_pa from pedidos_abastecimiento", cb);
}

function getLastNroPa(cb){
	conn("select ifnull(max(nro_pa), 0) as nro_pa from pedidos_abastecimiento", cb)
}

function getPAsfiltrados(query, cb){
	conn(query, cb);
}

function postMarcarRevisado(id, cb){
	conn("UPDATE pedidos_abastecimiento SET pedidos_abastecimiento.estado = 'a Aprobar' WHERE pedidos_abastecimiento.id = "+id, cb);
}

function postMarcarAprobado(id, cant, id_aprobo, fecha_aprobado, cb){
	// FALTA UPDATEAR LA CANT APROBADA
	conn("UPDATE pedidos_abastecimiento SET pedidos_abastecimiento.estado = 'Aprobado', cantidad_aprobada = "+cant+", id_autorizo_fk = "+id_aprobo+", fecha_autorizado = '"+fecha_aprobado+"'  WHERE pedidos_abastecimiento.id = "+id, cb);
}

function postMarcarRechazado(id, motivo, id_rechazo, fecha_rechazado, cb){
	// FALTA UPDATEAR MOTIVO RECHAZO
	conn("UPDATE pedidos_abastecimiento SET pedidos_abastecimiento.estado = 'Rechazado', motivo_rechazo = '"+motivo+"', id_autorizo_fk = "+id_rechazo+", fecha_autorizado = '"+fecha_rechazado+"' WHERE pedidos_abastecimiento.id = "+id, cb);
}

function getItemById(id, cb){
	conn("SELECT pedidos_abastecimiento.*, DATE_FORMAT(pedidos_abastecimiento.fecha_necesidad, '%d/%m/%Y') as fecha_necf from pedidos_abastecimiento WHERE pedidos_abastecimiento.id = "+id, cb);
}

function update(id_pa, id_art, cant, fecha_nec, id_responsable, id_centrocosto, urgente, id_sector, cb){
	conn("UPDATE `maresa`.`pedidos_abastecimiento` SET `id_centrocosto_fk` = "+id_centrocosto+", `id_responsable_fk` = "
		+id_responsable+", `fecha_necesidad` = '"+fecha_nec+"', `id_articulo_fk` = "+id_art+", `cantidad` = "+cant+", "
		+"`urgente` = "+urgente+", `id_sector_fk` = "+id_sector+" WHERE `id` = "+id_pa, cb);
}

function del(id_pa, cb){
	conn("DELETE FROM maresa.pedidos_abastecimiento WHERE maresa.pedidos_abastecimiento.id = "+id_pa, cb)
}