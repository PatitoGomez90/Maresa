var conn = require('../config/db').conn;

module.exports = {
	getAll: getAll,
	getAllByPartediario1Id: getAllByPartediario1Id,
	insertNewEmpleado: insertNewEmpleado,
	getById: getById,
	update: update,
	del: del,
	delByIdpartediario1: delByIdpartediario1,
	getEmpleInPartediario2: getEmpleInPartediario2,
	getLastNumerobyPd1: getLastNumerobyPd1,
	get_NextPd2: get_NextPd2,
	updateAll: updateAll,
	updateOne: updateOne
}

function getAll(cb){
	//sectortxt lugartxt fechaf
	conn("select partediario1.*, DATE_FORMAT(partediario1.fecha, '%d/%m/%Y') as fechaf, "+
		"lugares.nombre as lugartxt, "+
		"sectores.nombre as sectortxt "+
		"from partediario1 "+
		"left join lugares on lugares.id = partediario1.id_lugar_fk "+
		"left join sectores on sectores.id = partediario1.id_sector_fk", cb);
}

function getAllByPartediario1Id(id, cb){
	conn("select partediario2.*, emple.legajo as legajo, emple.nombre as nombre, codigohora.numero as codigohoracod "+
		"from partediario2 "+
		"left join codigohora on codigohora.id = partediario2.id_codigohora_fk "+
		"left join emple on emple.codigo = partediario2.id_emple_fk "+
		"where partediario2.id_partediario1_fk="+id+" order by numero", cb);
}

function getById(id, cb){
	conn("select partediario2.*, "+
		"emple.legajo as legajo, "+
		"emple.nombre as nombre, "+
		"emple.tarjeta as tarjeta, "+
		"codigohora.nombre as codigohoratxt "+
		// "(select )"+
		"from partediario2 "+
		"left join emple on emple.codigo = partediario2.id_emple_fk "+
		"left join codigohora on codigohora.id = partediario2.id_codigohora_fk "+
		"where partediario2.id="+id, cb);
}

function insertNewEmpleado(idpartediario1, idempleado, numero, cb){
	beg(function(){
		conn("insert into partediario2(id_partediario1_fk, id_emple_fk, numero) "+
		"values("+idpartediario1+", "+idempleado+", "+numero+");", function(){
			com(cb);
		});
	});
	
}

function beg(cb){
	conn("START TRANSACTION;", cb);
}

function com(cb){
	conn("COMMIT;", cb);
}

function update(id, codigohora, entrada, salida, total, hr_total_n, hr_total_50, hr_total_100, adicional1_n, adicional1_50, adicional1_100, adicional2_n, adicional2_50, adicional2_100, adicional3_n, adicional3_50, adicional3_100, adicional4_n, adicional4_50, adicional4_100, adicional5_n, adicional5_50, adicional5_100, adicional6_n, adicional6_50, adicional6_100, item1_n, item1_50, item1_100, item2_n, item2_50, item2_100, item3_n, item3_50, item3_100, item4_n, item4_50, item4_100, item5_n, item5_50, item5_100, item6_n, item6_50, item6_100, item7_n, item7_50, item7_100, item8_n, item8_50, item8_100, item9_n, item9_50, item9_100, item10_n, item10_50, item10_100, item11_n, item11_50, item11_100, item12_n, item12_50, item12_100, cb){
	conn("UPDATE `partediario2` SET `id_codigohora_fk`="+codigohora+", `hr_entrada`='"+entrada+"', `hr_salida`='"+salida+"', "+
		"`hr_total`='"+total+"', hr_total_n = '"+hr_total_n+"', hr_total_50 = '"+hr_total_50+"', hr_total_100 = '"+hr_total_100+"',	"+
		"`adicional1_n`="+adicional1_n+",`adicional1_50`="+adicional1_50+", `adicional1_100`="+adicional1_100+", "+
		"`adicional2_n`="+adicional2_n+",`adicional2_50`="+adicional2_50+", `adicional2_100`="+adicional2_100+", "+
		"`adicional3_n`="+adicional3_n+",`adicional3_50`="+adicional3_50+", `adicional3_100`="+adicional3_100+", "+
		"`adicional4_n`="+adicional4_n+",`adicional4_50`="+adicional4_50+", `adicional4_100`="+adicional4_100+", "+
		"`adicional5_n`="+adicional5_n+",`adicional5_50`="+adicional5_50+", `adicional5_100`="+adicional5_100+", "+
		"`adicional6_n`="+adicional6_n+",`adicional6_50`="+adicional6_50+", `adicional6_100`="+adicional6_100+", "+
		"item1_n="+item1_n+", item1_50="+item1_50+", item1_100="+item1_100+", "+ 
		"item2_n="+item2_n+", item2_50="+item2_50+", item2_100="+item2_100+", "+
		"item3_n="+item3_n+", item3_50="+item3_50+", item3_100="+item3_100+", "+
		"item4_n="+item4_n+", item4_50="+item4_50+", item4_100="+item4_100+", "+
		"item5_n="+item5_n+", item5_50="+item5_50+", item5_100="+item5_100+", "+ 
		"item6_n="+item6_n+", item6_50="+item6_50+", item6_100="+item6_100+", "+ 
		"item7_n="+item7_n+", item7_50="+item7_50+", item7_100="+item7_100+", "+ 
		"item8_n="+item8_n+", item8_50="+item8_50+", item8_100="+item8_100+", "+ 
		"item9_n="+item9_n+", item9_50="+item9_50+", item9_100="+item9_100+", "+ 
		"item10_n="+item10_n+", item10_50="+item10_50+", item10_100="+item10_100+", "+ 
		"item11_n="+item11_n+", item11_50="+item11_50+", item11_100="+item11_100+", "+ 
		"item12_n="+item12_n+", item12_50="+item12_50+", item12_100="+item12_100+" "+
		"WHERE partediario2.id ="+id, cb);
}

function del(id, cb){
	conn("delete from partediario2 where partediario2.id="+id, cb);
}

function delByIdpartediario1(id, cb){
	conn("delete from partediario2 where partediario2.id_partediario1_fk="+id, cb);
}

function getEmpleInPartediario2(idp1, idemple, cb){
	conn("select count(id_partediario1_fk) as cant from partediario2 where id_partediario1_fk="+idp1+" and id_emple_fk="+idemple, cb);
}

//para el agregar de a 1 empleado
	function getLastNumerobyPd1(idp1, cb){
		conn("SELECT max(numero) as ultnumero FROM `partediario2` WHERE `id_partediario1_fk`="+idp1, cb);
	}

// para el boton siguiente
	function get_NextPd2(idp1, num, cb){
		conn("select * from partediario2 where id = (select min(id) from partediario2 where numero = "+num+"+1 and id_partediario1_fk = "+idp1+")", cb)
	}

function updateAll(idp1, codigohora, entrada, salida, total, hr_total_n, hr_total_50, hr_total_100, adicional1_n, adicional1_50, adicional1_100, adicional2_n, adicional2_50, adicional2_100, adicional3_n, adicional3_50, adicional3_100, adicional4_n, adicional4_50, adicional4_100, adicional5_n, adicional5_50, adicional5_100, adicional6_n, adicional6_50, adicional6_100, item1_n, item1_50, item1_100, item2_n, item2_50, item2_100, item3_n, item3_50, item3_100, item4_n, item4_50, item4_100, item5_n, item5_50, item5_100, item6_n, item6_50, item6_100, item7_n, item7_50, item7_100, item8_n, item8_50, item8_100, item9_n, item9_50, item9_100, item10_n, item10_50, item10_100, item11_n, item11_50, item11_100, item12_n, item12_50, item12_100, cb){
	conn("UPDATE `partediario2` SET `id_codigohora_fk`="+codigohora+", `hr_entrada`='"+entrada+"', `hr_salida`='"+salida+"', "+
		"`hr_total`='"+total+"', hr_total_n = '"+hr_total_n+"', hr_total_50 = '"+hr_total_50+"', hr_total_100 = '"+hr_total_100+"',	"+
		"`adicional1_n`="+adicional1_n+",`adicional1_50`="+adicional1_50+", `adicional1_100`="+adicional1_100+", "+
		"`adicional2_n`="+adicional2_n+",`adicional2_50`="+adicional2_50+", `adicional2_100`="+adicional2_100+", "+
		"`adicional3_n`="+adicional3_n+",`adicional3_50`="+adicional3_50+", `adicional3_100`="+adicional3_100+", "+
		"`adicional4_n`="+adicional4_n+",`adicional4_50`="+adicional4_50+", `adicional4_100`="+adicional4_100+", "+
		"`adicional5_n`="+adicional5_n+",`adicional5_50`="+adicional5_50+", `adicional5_100`="+adicional5_100+", "+
		"`adicional6_n`="+adicional6_n+",`adicional6_50`="+adicional6_50+", `adicional6_100`="+adicional6_100+", "+
		"item1_n="+item1_n+", item1_50="+item1_50+", item1_100="+item1_100+", "+ 
		"item2_n="+item2_n+", item2_50="+item2_50+", item2_100="+item2_100+", "+
		"item3_n="+item3_n+", item3_50="+item3_50+", item3_100="+item3_100+", "+
		"item4_n="+item4_n+", item4_50="+item4_50+", item4_100="+item4_100+", "+
		"item5_n="+item5_n+", item5_50="+item5_50+", item5_100="+item5_100+", "+ 
		"item6_n="+item6_n+", item6_50="+item6_50+", item6_100="+item6_100+", "+ 
		"item7_n="+item7_n+", item7_50="+item7_50+", item7_100="+item7_100+", "+ 
		"item8_n="+item8_n+", item8_50="+item8_50+", item8_100="+item8_100+", "+ 
		"item9_n="+item9_n+", item9_50="+item9_50+", item9_100="+item9_100+", "+ 
		"item10_n="+item10_n+", item10_50="+item10_50+", item10_100="+item10_100+", "+ 
		"item11_n="+item11_n+", item11_50="+item11_50+", item11_100="+item11_100+", "+ 
		"item12_n="+item12_n+", item12_50="+item12_50+", item12_100="+item12_100+" "+
		"WHERE partediario2.id_partediario1_fk ="+idp1, cb);
}

function updateOne(idp1, nombrecampo, valor, cb){
	if (valor.length > 4){
		if (valor.indexOf(":") > -1)
			conn("UPDATE partediario2 SET "+nombrecampo+" = '"+valor+"' WHERE partediario2.id_partediario1_fk ="+idp1, cb);
	}else{
		conn("UPDATE partediario2 SET "+nombrecampo+" = "+valor+" WHERE partediario2.id_partediario1_fk ="+idp1, cb);
	}
}