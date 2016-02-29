var conn = require('../config/db').conn;

module.exports = {
	getAllUsuarios: getAllUsuarios,
	insertUsuario: insertUsuario,
	getUsuarioPorID: getUsuarioPorID,
	updateUsuario: updateUsuario,
	delUsuario: delUsuario,
	getUsuarioPorUser: getUsuarioPorUser,
	getUsuarioPorMail: getUsuarioPorMail,
	getLastUnica: getLastUnica
}

function getAllUsuarios(cb){
	conn("select *, DATE_FORMAT(secr.baja, '%d/%m/%Y') as bajaf, DATE_FORMAT(secr.alta, '%d/%m/%Y') as altaf from secr", cb);
}

function getUsuarioPorID(id, cb){
	conn("select *, DATE_FORMAT(secr.baja, '%d/%m/%Y') as bajaf, DATE_FORMAT(secr.alta, '%d/%m/%Y') as altaf from secr where Unica =" + id, cb);
}

function getUsuarioPorUser(usuario, cb){
	conn("select *, DATE_FORMAT(secr.baja, '%d/%m/%Y') as bajaf, DATE_FORMAT(secr.alta, '%d/%m/%Y') as altaf from secr where usuario='" + usuario + "'", cb);
}

function getUsuarioPorMail(mail, cb){
	conn("select *, DATE_FORMAT(secr.baja, '%d/%m/%Y') as bajaf, DATE_FORMAT(secr.alta, '%d/%m/%Y') as altaf from secr where mail='" + mail + "'", cb)
}

function insertUsuario(usuario, clave, mail, niveles, alta, baja, activa, cb){
	conn("INSERT INTO secr(usuario,	clave, mail, niveles, alta,	baja, activa) VALUES('"+ 
	   	usuario +"','"+ clave +"','"+ mail +"','"+ niveles +"','"+ alta +"','"+ baja +"',"+activa+")", cb);
}

function updateUsuario(id, usuario, clave, mail, niveles, alta, baja, activa, cb){
	conn("UPDATE secr SET usuario ='"+usuario+"', clave='"+clave+"', mail='"+mail+"', niveles='"+niveles+"', alta='"+alta+"', baja='"+baja+"' , activa="+activa+" WHERE unica = "+ id, cb );
}

function delUsuario(id, cb) {
  conn("DELETE FROM secr where unica ="+ id, cb);
}

function getLastUnica(cb){
	conn("select max(unica) as ultimoid from secr", cb);
}

