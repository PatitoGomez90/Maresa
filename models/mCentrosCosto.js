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

function insert(nombre, cb){
	conn("insert into centro_costos(nombre) values('"+nombre+"')", cb);
}

function update(id, nombre, cb){
	conn("update centro_costos set nombre = '"+nombre+"' where id ="+id, cb);
}

function del(id, cb){
	conn("delete from centro_costos where id = "+id, cb);
}