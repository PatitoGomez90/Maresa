var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getById: getById,
	insert: insert,
	update: update,
	del: del
}

function getAll(cb){
	conn('select * from centro_costos', cb);
}

function getById(id, cb){
	conn("select * from centro_costos where id = "+id, cb);
}

function insert(codigo, nombre, cb){
	conn("insert into centro_costos(codigo, nombre) values('"+codigo+"', '"+nombre+"')", cb);
}

function update(id, codigo, nombre, cb){
	conn("update centro_costos set nombre = '"+nombre+"', codigo = '"+codigo+"' where id ="+id, cb);
}

function del(id, cb){
	conn("delete from centro_costos where id = "+id, cb);
}