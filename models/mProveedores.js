var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	insert: insert,
	getById: getById,
	update: update,
	del: del,
	getLastNumero: getLastNumero,
	verificarNumero: verificarNumero
}

function getAll(cb){
	conn('select proveedores.*, provincias.descripcion as txtprovincia, iva.descripcion as txtiva from proveedores left join provincias on proveedores.id_provincia_fk = provincias.id left join iva on iva.id = proveedores.id_iva_fk order by numero', cb);
}

function insert(numero, razonsocial, direccion, localidad, provincia, codigopostal, telefono, fax, cuit, ganancias, iva, celular, mail, contacto, diashorarios, calificacion, cb){
	conn("insert into proveedores(numero, razonsocial, direccion, localidad, id_provincia_fk, codigopostal, telefono, fax, cuit, ganancias, id_iva_fk, "+
		"celular, mail, contacto, diashorario, calificacion) values("+numero+", '"+razonsocial+"', '"+direccion+"', '"+localidad+"', "+
		provincia+", '"+codigopostal+"', '"+telefono+"', '"+fax+"', '"+cuit+"', '"+ganancias+"', "+iva+", '"+celular+"', '"+mail+"', '"+
		contacto+"', '"+diashorarios+"', '"+calificacion+"')", cb);
}

function getById(id_proveedor, cb){
	conn("select proveedores.*, provincias.descripcion as txtprovincia, iva.descripcion as txtiva from proveedores left join provincias on proveedores.id_provincia_fk = provincias.id left join iva on iva.id = proveedores.id_iva_fk where proveedores.id = "+id_proveedor, cb);
}

function update(id, numero, razonsocial, direccion, localidad, id_provincia, codigopostal, telefono, fax, cuit, ganancias, id_iva, celular, mail, contacto, diashorarios, calificacion, cb){
	conn("UPDATE `proveedores` SET `numero`='"+numero+"', `razonsocial`='"+razonsocial+"',`direccion`='"+direccion+"',`localidad`='"+localidad+
		"', `id_provincia_fk`="+id_provincia+", `codigopostal`='"+codigopostal+"',`telefono`='"+telefono+"',`fax`='"+fax+"',`cuit`='"+cuit+
		"', `ganancias`='"+ganancias+"',`id_iva_fk`="+id_iva+",`celular`='"+celular+"', `mail`='"+mail+"',`contacto`='"+contacto+"', "+
		"diashorario='"+diashorarios+"',`calificacion`='"+calificacion+"' WHERE id ="+id, cb);
}

function del(id_proveedor, cb){
	conn("delete from proveedores where id = "+id_proveedor, cb);
}

function getLastNumero(cb){
	conn("select max(numero) as numero from proveedores", cb);
}

function verificarNumero(nro_prov, cb){
	conn("select * from proveedores where numero = "+nro_prov, cb);
}