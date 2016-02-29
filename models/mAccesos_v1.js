var conn = require('../config/db').conn;

module.exports = {
	getAccesosPorUsuario: getAccesosPorUsuario,
	getMenues: getMenues,
	getAccesos: getAccesos,
	addAccesos: addAccesos,
	insertAcceso: insertAcceso
}

function getAccesosPorUsuario(idusuario, cb){
	conn('select * from secr2 where unica='+idusuario, cb);
}

function getMenues(cb){
	conn("select * from ayuda", cb)
}

function getAccesos(cb){
	conn("select * from accesos", cb)
}

function insertAcceso(idusuario, menu, cb){
	conn("insert into secr2(unica, menu, a, b, c, m) values ("+idusuario+", "+menu+",0, 0, 0, 0);", cb)
}
function addAccesos(idusuario, accesos, cb){
	//hacer un select de usuario filtrando por idusuario, si existe el usuario tengo que updatear, sino hacer el insert.
	getAccesosPorUsuario(idusuario, function(docs){
		console.log("docs: "+docs);
		if (docs != null){
			//update
			conn('DELETE FROM secr2 where unica='+idusuario, cb);
			//insert
			var query = 'INSERT INTO secr2(unica, menu, a, b, m, c) VALUES';
			for (var i = 1; i <= 4; i++) {
				var menu = accesos[i];
				console.log("accesos ---------------------- "+ accesos[i] )
				query += '('+idusuario+','+i;
				for (var c = 0, len = menu.length; c < len; c++) {
					query += ',' + menu[c].checked;
				}
				query += i == 4 ? ');' : '),';
			}
			conn(query, cb);
		}else{
			//insert
			var query = 'INSERT INTO secr2(unica, menu, a, b, m, c) VALUES';
			for (var i = 1; i <= 4; i++) {
				var menu = accesos[i];
				query += '('+idusuario+','+i;
				for (var c = 0, len = menu.length; c < len; c++) {
					query += ',' + menu[c].checked;
				}
				query += i == 4 ? ');' : '),';
			}
			conn(query, cb);
		}
	});
}