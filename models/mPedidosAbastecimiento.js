var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getUltimoCodigo: getUltimoCodigo
}

function getAll(cb){
	conn('select * from pedidos_abastecimiento', cb);
}

function getUltimoCodigo(cb){
	conn("select max(nro_pa) as nro_pa from pedidos_abastecimiento", cb);
}