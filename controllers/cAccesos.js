//requiriendo modelo mensaje.js:
var mAccesos = require('../models/mAccesos');

var mysql = require('mysql');
var async = require('async');

module.exports = {
    getAccesos: getAccesos,
    postAccesos: postAccesos,
    updateAcceso: updateAcceso
}

function getAccesos(req, res){
    var params = req.params;
    var idusuario = params.id; 

    var connection = mysql.createConnection({
        user: 'root',
        password: '',
        host: '127.0.0.1',
        port: '3306',
        database: 'Maresa',
        dateStrings : true
    });

    mAccesos.getMenues(function (menues){
        // console.log(menues.length)
        mAccesos.getAccesos(function (accesos){
            mAccesos.getAccesosPorUsuario(idusuario, function (accesosxusuario){
                // console.log(accesosxusuario.length)

                // VER DE AGREGAR LOS MENUES FALTANAS A SECR2
                mAccesos.getLastMenuId(function (lastmenuid){
                    // console.log(lastmenuid[0]);
                    mAccesos.getLastAccesoId(idusuario, function (lastAccesoIdDeUsuario){                        
                        // console.log(lastAccesoIdDeUsuario[0]);
                        lastmenuid2 = lastmenuid[0].id;
                        lastAccesoIdDeUsuario2 = lastAccesoIdDeUsuario[0].menu;
                        if (lastmenuid2 == lastAccesoIdDeUsuario2){
                            // console.log("true");
                            res.render('accesoslista', {
                                idUsuario: idusuario,
                                pagename: 'Lista de Accesos',
                                menues: menues,
                                accesos: accesos,
                                usuario_accesos: accesosxusuario
                            });
                        }else{
                            // console.log("false");
                            connection.connect();
                            async.eachSeries(menues, function (menu, callback) {

                                // para cada menu, mandar id_menu y id_usuario y verificar si existe en secr2, si existe pasa al siguiente
                                // y si no existe crea el nuevo registro con valores en 0

                                query = "select * from secr2 where unica = "+idusuario+" AND menu = "+menu.id;
                                connection.query(query, function (err, rows, fields) {
                                    if (err) {
                                        throw err;
                                        console.log(err);
                                    }else{
                                        // console.log("resultado primer query")
                                        // console.log(rows.length)
                                        if (rows.length > 0){
                                            console.log("ya existe este menú para este usuario en secr2! =)");
                                            callback();
                                        }else{
                                            query2 = "insert into secr2(unica, menu, a, b, c, m) values ("+idusuario+", "+menu.id+", 0, 0, 0, 0);";
                                            console.log(query2)
                                            connection.query(query2, function (err, rows, fields) {
                                                if (err) {
                                                    throw err;
                                                    console.log(err);
                                                }else{
                                                    callback();
                                                    // console.log("asd :S")
                                                }
                                            });
                                        }
                                    }                       
                                });
                            }, function (err) {
                                if (err) { 
                                    throw err; 
                                }else{
                                    // res.send("finishedd");
                                    connection.end();
                                    mAccesos.getMenues(function (menues){
                                        // console.log(menues.length)
                                        mAccesos.getAccesos(function (accesos){
                                            mAccesos.getAccesosPorUsuario(idusuario, function (accesosxusuario){
                                                res.render('accesoslista', {
                                                    idUsuario: idusuario,
                                                    pagename: 'Lista de Accesos',
                                                    menues: menues,
                                                    accesos: accesos,
                                                    usuario_accesos: accesosxusuario
                                                });
                                            });
                                        });
                                    });
                                }               
                            }); 
                        } 
                    });
                });                               
            });
        });
    });
}

function postAccesos(req, res){
    var idUsuario = req.body.idUsuario;
    var accesos = {};
    mAccesos.getMenues(function (docs){
        mAccesos.getAccesos(function (accesos){
            docs.forEach(function (menu, idx) {
                accesos[menu.id] = [];
                accesos.forEach(function (acceso, idx2) {
                    if (req.body[menu.id+'-'+acceso.descripcion] == 'on') {
                        accesos[menu.id].push({ acceso: acceso.descripcion, checked: true });
                    } else {
                        accesos[menu.id].push({ acceso: acceso.descripcion, checked: false });
                    }
                });
            });
            //console.log(accesos);
            mAccesos.addAccesos(idUsuario, accesos, function() {
                res.redirect('/usuarioslista')
            })
        });
    });
}

function updateAcceso(req, res){
    var params = req.params;
    var id_menu = params.id_menu;
    var acceso_short = params.acceso_short;
    var value = params.value;
    // console.log(req.session)
    var id_usuario = params.id_usuario;

    mAccesos.updateAcceso(id_usuario, id_menu, acceso_short, value, function (){
        res.send("exito!")
    });
}