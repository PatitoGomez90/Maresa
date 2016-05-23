var SQLconn = require('../config/db').SQLconn;
var conn = require('../config/db').conn;

module.exports = {
	getFichadasFromSQL: getFichadasFromSQL,
	getFichada: getFichada,
	getLastFicIdMySql: getLastFicIdMySql,
	getLatestFicSQL: getLatestFicSQL,
	SQLinsert: SQLinsert,
	getAllFromFichadaSQL: getAllFromFichadaSQL,
	MySqlInsert: MySqlInsert,
	SQLifIDexists: SQLifIDexists,
	getByQueryFromMySql: getByQueryFromMySql,
	getByTarjetayFechas: getByTarjetayFechas,
	getFichadasPorSector: getFichadasPorSector,
	getFichadasReloj37_since03_2016: getFichadasReloj37_since03_2016
	// getAllFromMySql: getAllFromMySql,
	// getAllByDesdeFromMySql: getAllByDesdeFromMySql,
	// getAllByHastaFromMySql: getAllByHastaFromMySql,
	// getAllByFechaFromMySql: getAllByFechaFromMySql
}

function getFichadasFromSQL(fecha, cb){
	SQLconn("select MAX(convert(varchar, fic_fecha, 103)) as fecha, "+
		"fic_reloj as reloj, "+
		"COUNT(DISTINCT FIC_TARJETA) as cant, "+
		"(select COUNT(DISTINCT FIC_TARJETA) "+
		"from FICHADA "+
		"where FIC_FECHA='"+fecha+"' "+
		"AND FIC_ENTSAL='E' ) as entraron, "+
		"(select COUNT(DISTINCT FIC_TARJETA) "+
			"from FICHADA where FIC_FECHA='"+fecha+"' AND FIC_ENTSAL='S' ) as salieron "+
		"from fichada "+
		"where fic_fecha='"+fecha+"' "+
		"group by fic_reloj", cb);
}

function getFichada(reloj, fecha, cb){
	SQLconn("select * from fichada where fic_reloj ="+reloj+" and fic_fecha='"+fecha+"'", cb)
}

function getAllFromFichadaSQL(cb){
	SQLconn("select * from fichada", cb);
}

function getLastFicIdMySql(cb){
	conn("select max(fic_id) as maxfic_id from fichadas", cb);
}

function getLatestFicSQL(lastficid, cb){
	SQLconn("select fichada.*, convert(varchar, fichada.fic_fecha, 111) as fic_fechafmysql "+
		"from fichada "+
		"where fic_reloj in (33, 34, 35, 36, 37) "+
		"and leg_legajo > 0 "+
		"and fic_id > "+lastficid+" "+
		"and fic_fecha >= '2015-07-01' "+
		"order by leg_legajo", cb);
}

function SQLinsert(latestfic, cb){
	SQLconn("INSERT INTO `fichada`(`fic_id`, `leg_legajo`, `fic_tarjeta`, `fic_fecha`, `fic_hora`, `fic_entsal`, `fic_reloj`, "+
		"`fic_origen`, `fic_novedad`, `fic_equipo`, `fic_notas`) VALUES ("+latestfic[0].fic_id+", "+latestfic[0].leg_legajo+
		", "+latestfic[0].fic_tarjeta+", '"+latestfic[0].fic_fecha+"', '"+latestfic[0].fic_hora+"', '"+latestfic[0].fic_entsal+
		"', "+latestfic[0].fic_reloj+", '"+latestfic[0].fic_origen+"', "+latestfic[0].fic_novedad+", '"+latestfic[0].fic_equipo+
		"', '"+latestfic[0].fic_notas+"')", cb)
}

function MySqlInsert(latestfic, cb){
	//console.log("- - Asi recibo el obj para insertar a mysql:");
	//console.log(latestfic)
	conn("INSERT INTO `fichadas`(`fic_id`, `leg_legajo`, `fic_tarjeta`, `fic_fecha`, `fic_hora`, `fic_entsal`, `fic_reloj`, "+
		"`fic_origen`, `fic_novedad`, `fic_equipo`, `fic_notas`) VALUES ("+latestfic.FIC_ID+", 0, "+latestfic.FIC_TARJETA+
		", '"+latestfic.fic_fechafmysql+"', '"+latestfic.FIC_HORA+"', '"+latestfic.FIC_ENTSAL+"', "+latestfic.FIC_RELOJ+
		", '"+latestfic.FIC_ORIGEN+"', "+latestfic.FIC_NOVEDAD+", '"+latestfic.FIC_EQUIPO+"', '"+latestfic.FIC_NOTAS+"')", cb)
}

function SQLifIDexists(newerficid, cb){
	SQLconn("select fic_id from fichada where fic_id = "+newerficid, cb);
}

//estas son para el filtro ajax de fichadaslista
	function getByQueryFromMySql(query, cb){
		conn(query, cb);
	}

//para partediario2modificar
	function getByTarjetayFechas(tarjeta, hoy, maniana, cb){
		////
		conn("SELECT fic_id, fic_reloj, fic_entsal, DATE_FORMAT(fichadas.fic_fecha, '%d/%m/%Y') as fic_fechaf, fic_hora "+
			"FROM fichadas where fic_tarjeta = "+tarjeta+" and fic_fecha in ('"+hoy+"', '"+maniana+"') order by fic_id ", cb);
	}

//para fichadas por sector
	function getFichadasPorSector(fecha, cb){
		conn("select fichadas.fic_reloj as id_reloj, max(sectores.nombre) as sectortxt, count(distinct fichadas.id) as cantidad "+
			"from fichadas "+
			"left join relojes on relojes.numero = fichadas.fic_reloj "+
			"left join sectores on sectores.id = relojes.id_sector_fk "+
			"where fichadas.fic_fecha='"+fecha+"' and fic_entsal = 'E' and sectores.nombre != '' group by relojes.id_sector_fk", cb)
	}

function getFichadasReloj37_since03_2016(cb){
	SQLconn("select fichada.*, convert(varchar, fichada.fic_fecha, 111) as fic_fechafmysql "+
		"from fichada "+
		"where fic_reloj = 37 "+
		"and leg_legajo > 0 "+
		"and fic_fecha >= '2016-03-01' "+
		"order by leg_legajo", cb);
}