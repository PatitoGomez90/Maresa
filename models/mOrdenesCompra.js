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
	conn("select ordenes_compra.*, "
		+"DATE_FORMAT(ordenes_compra.fecha_generacion, '%d/%m/%Y') as fecha_genf, "
		+"DATE_FORMAT(ordenes_compra.fecha_necesidad, '%d/%m/%Y') as fecha_necf, "
		+"proveedores.razonsocial as proveedortxt, "
		+"proveedores.contacto as proveedor_contacto, "
		+"proveedores.telefono as proveedor_telefono, "
		+"proveedores.direccion as proveedor_domicilio, "
		+"proveedores.localidad as proveedor_ciudad, "
		+"provincias.descripcion as proveedor_provincia, "
		+"secr.usuario as emitiotxt "
		+"FROM ordenes_compra "
		+"LEFT JOIN proveedores ON proveedores.id = ordenes_compra.id_proveedor_fk "
		+"LEFT JOIN provincias ON provincias.id = proveedores.id_provincia_fk "
		+"LEFT JOIN secr ON secr.unica = ordenes_compra.id_user_emitio_fk "
		+"WHERE ordenes_compra.id = "+id, cb);
}