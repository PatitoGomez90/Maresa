var conn = require('../config/db').conn;
var mEventos = require('../models/mEventos');
var mNovedades = require('../models/mNovedades');

module.exports = {
	getLogin: getLogin,
	postLogin: postLogin,
	getAdmin: getAdmin
}

function changeDate(date){
	// input: dd/mm/yyyy
	fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
	return fechaus;
	// output: yyyy/mm/dd
}

function changeDate2(date){
	// input: yyyy/mm/dd
	fechaus = date.substring(8,10) + "/" + date.substring(5,7) + "/" + date.substring(0,4);
	return fechaus;
	// output: dd/mm/yyyy
}

function getLogin(req, res){
	//console.log('ADENTRO DE GET LOGIN')
	res.render('login',{
		pagename: 'Maresa Login',
		errors: req.session.errors,
	});
}

function getAdmin(req, res){
	res.render('admin/admin');
}

function postLogin(req, res){
	//console.log('ADENTRO DE POST LOGIN')
	var form = req.body;
	if (form.email && form.password){
		conn("select * from secr where mail='"+ form.email +"'", function(user){
			user = user[0];
			console.log(user)
			if (user) {
				if (user.clave === form.password) {
					if ( entreFechas(user.alta, user.baja) ) {
						if (user.activa == 1){

							req.session.user = user;
							req.session.auth = true;

							date = new Date()
							day = date.getDate();
							if (day<10)
								day = "0"+day;
							month = (date.getMonth() + 1);
							if (month<10)
								month = "0"+month;
							date = date.getFullYear() + '/' + month + '/' +  day;
							req.session.user.horaLogin = date;

							mEventos.add(req.session.user.unica, date, "Login", "", function(){
									res.redirect('/inicio')
							});
						}else{
							res.redirect('/')
						}
					} else {
						res.redirect('/')
					}
				}else{
					res.render('error', {
						error: "Usuario o Contraseña incorrectos."
					});
				} 
			}else{
				res.render('error', {
					error: "Usuario o Contraseña incorrectos."
				});
				// req.session.errors = 'Usuario o Contraseña incorrectos.';
				// console.log("sarasa")
				// return res.redirect('/');
			}
		});
	} else {
		req.session.errors = 'Campos obligatorios.';
		res.redirect('/');
	}
}

function entreFechas (alta, baja) {

	if ( new Date(alta).getTime() < new Date().getTime() ) {

		if ( new Date(baja).getTime() > new Date().getTime() ) {

			return true;

		} else {

			return false;
		}

	} else {
		return false;
	}

}