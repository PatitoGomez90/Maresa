var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getAllActivos: getAllActivos,
	insert: insert,
	getById: getById,
	update: update,
	del: del,
	insert2: insert2,
	getItemById: getItemById,
	getUltimoNumero: getUltimoNumero,
	getGeneralesAndBySectorId: getGeneralesAndBySectorId
}

function getAll(cb){
	conn("select items.*, sectores.nombre as sectortxt, lugares.nombre as lugartxt, contratos.nombre as contratotxt, "+
		"umed.nombre as umedtxt "+
		"FROM items "+
		"LEFT JOIN sectores on sectores.id = items.id_sector_fk "+
		"LEFT JOIN lugares on lugares.id = items.id_lugar_fk "+
		"LEFT JOIN contratos on contratos.id = items.id_contrato_fk "+
		"LEFT JOIN umed on umed.id = items.id_umed_fk", cb);
}

function getAllActivos(cb){
	conn("select items.*, sectores.nombre as sectortxt, lugares.nombre as lugartxt, contratos.nombre as contratotxt, "+
		"umed.nombre as umedtxt "+
		"from items "+
		"left join sectores on sectores.id = items.id_sector_fk "+
		"left join lugares on lugares.id = items.id_lugar_fk "+
		"left join contratos on contratos.id = items.id_contrato_fk "+
		"left join umed on umed.id = items.id_umed_fk where items.activa = 1 order by items.numero", cb);
}

function insert(numero, nombre, sector, lugar, umed, horas_standard, contrato, cb){
	conn("insert into items(numero, nombre, id_sector_fk, id_lugar_fk, id_umed_fk, horas_standard, id_contrato_fk, activa) "+
		"values("+numero+", '"+nombre+"', "+sector+", "+lugar+", "+umed+", "+horas_standard+", "+contrato+", 1)", cb)
}

function insert2(numero, nombre, sector, um, cb){
	conn("insert into items(numero, nombre, id_sector_fk, um) values("+numero+", '"+nombre+"', "+sector+", '"+um+"', 1)", cb)
}

function getById(id, cb){
	conn("select * from items where id="+id, cb);
}

function getItemById(id, cb){
	conn("select * from items where id="+id, cb);
}

function update(id, numero, nombre, sector, lugar, umed, horas_standard, contrato, activo, cb){
	conn("update items set numero ="+numero+", nombre='"+nombre+"', id_sector_fk = "+sector+", id_lugar_fk = "+lugar+
		", id_umed_fk ="+umed+", horas_standard ="+horas_standard+", id_contrato_fk = "+contrato+", activa="+activo+
		" where id="+id, cb);
}

function getUltimoNumero(cb){
	conn("select max(numero) as numero from items", cb);
}

function del(id, cb){
	conn("delete from items where id="+id, cb);
}

function getGeneralesAndBySectorId(sectorid, cb){
	conn("select * from items where id_sector_fk= 8 or id_sector_fk="+sectorid, cb);
}