var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getUltimoCodigo: getUltimoCodigo,
	getLastNroPa: getLastNroPa
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