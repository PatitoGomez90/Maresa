var conn = require('../config/db').conn;

module.exports = {
	insert: insert,
	getLastId: getLastId,
	del: del,
	getById: getById
}

function insert(fecha_generacion, fecha_necesidad, id_usuario_emite, id_proveedor, observaciones, cb){
	conn("INSERT INTO maresa.ordenes_compra (fecha_generacion, fecha_necesidad, id_proveedor_fk, observaciones, "
		+"id_user_emitio_fk) VALUES('"+fecha_generacion+"', '"+fecha_necesidad+"', "+id_proveedor+", '"+observaciones+"', "
		+id_usuario_emite+")", cb);
}

function getLastId(cb){
	conn("select max(id) as id from ordenes_compra", cb);
}

function del(id_oc, cb){
	conn("DELETE from maresa.ordenes_compra WHERE id = "+id_oc, cb);
}

function getById(id, cb){
	conn("select * from ordenes_compra where id = "+id, cb);
}