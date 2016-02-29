//requiriendo modelo mensaje.js:
var mUsuarios = require('../models/mUsuarios');
var mBorro = require('../models/mBorro');
var validator = require("validator");
var mVerificacion = require('../models/mVerificacion');
var mAyuda = require('../models/mAyuda');
var mAccesos = require('../models/mAccesos');

var mysql = require('mysql');
var async = require('async');

module.exports = {
    getUsuarios: getUsuarios,
    getUsuariosAlta: getUsuariosAlta,
    putUsuario: putUsuario,
    getUsuarioModificar: getUsuarioModificar,
    postUsuarioModificar: postUsuarioModificar,
    getDelUsuario: getDelUsuario
};

function changeDate(date){
    // input: dd/mm/yyyy
    fechaus = date.substring(6,10) + "/" + date.substring(3,5) + "/" + date.substring(0,2);
    return fechaus;
    // output: yyyy/mm/dd
}

function getUsuarios(req, res){
    req.session.nromenu = 1;
    mAyuda.getAyudaTexto(req.session.nromenu, function (ayuda){
        mUsuarios.getAllUsuarios(function(docs){
            res.render('usuarioslista', {
                pagename: 'Archivo de Usuarios',
                usuarios: docs,
                ayuda: ayuda[0]
            });
        });
    });
}

function getUsuariosAlta(req, res){
    mUsuarios.getAllUsuarios(function (docs){
        res.render('usuariosalta', {
            pagename: 'Alta de Usuarios',
            usuarios: docs
        });
    });
}

function getUsuarioModificar(req, res){
    //console.log(req.params);
    var params = req.params;
    var id = params.id;
    mUsuarios.getUsuarioPorID(id, function (docs){
        //console.log(docs[0])
        res.render('usuariosmodificar', {
            pagename: 'Modificar Usuario',
            usuario: docs[0]
        });
    });
}

function postUsuarioModificar(req, res){
    var params = req.body;
    var id= params.id;
    var usuario= params.usuario;
    var clave= params.clave;
    var niveles= params.niveles;
    var alta= params.alta;
    var baja= params.baja;
    var mail= params.mail;
    var activa= params.activa;
    if (activa == "on")
        activa = 1
    else
        activa = 0
    var alta2 = changeDate(alta);
    var baja2 = changeDate(baja);

    mUsuarios.updateUsuario(id, usuario, clave, mail, niveles, alta2, baja2, activa, function(){
        res.redirect('/usuarioslista');
    });
}

function putUsuario(req, res){
    var params = req.body;
    //var id= params.id;
    var usuario= params.usuario;
    var clave= params.clave;
    var clave2= params.repetirclave;
    var niveles= params.niveles;
    var alta= params.alta;
    var baja= params.baja;
    var mail= params.mail;
    var activa= "on";

    if (activa == "on")
        activa = 1
    else
        activa = 0
  
    alta2 = changeDate(alta);
    baja2 = changeDate(baja);

    mUsuarios.getUsuarioPorUser(usuario, function (resultado){
        //console.log(resultado);
        if (resultado[0] != null){
            //si existe el usuario
            res.render('error', {
                error: "Usuario existente. Intente nuevamente con otro usuario."
            });
        }else{
            //si no existe el usuario
            if (clave != clave2){
                //si las claves son distintas
                res.render('error', {          
                    error: "Las claves no coinciden. Intente ingresar de nuevo las claves."
                });
            }else{
                //si las claves son iguales
                if (validator.isEmail(mail)){
                    //si el mail ingresado es valido
                    mUsuarios.getUsuarioPorMail(mail, function (resultado){
                        console.log(resultado);
                        if(resultado[0]==null){ 
                            //si el email no existe
                            mUsuarios.insertUsuario(usuario, clave, mail, niveles, alta2, baja2, activa, function(){
                                //crear registros en secr para este usuario con todas las secciones de la tabla ayuda, con async?
                                mAyuda.getAll(function (menues){
                                    var connection = mysql.createConnection({
                                        user: 'root',
                                        password: '',
                                        host: '127.0.0.1',
                                        port: '3306',
                                        database: 'Maresa',
                                        dateStrings : true
                                    });
                                    connection.connect();
                                    mUsuarios.getLastUnica(function (userconlastunica){
                                        console.log(userconlastunica)
                                        var ultimoid = userconlastunica[0].ultimoid;

                                        async.eachSeries(menues, function (menu, callback) {                                        
                                            query = "INSERT INTO secr2(unica, menu, a, b, c, m) VALUES("+ultimoid+", "+menu.id+", 0, 0, 0, 0)";
                                            connection.query(query, function (err, rows, fields) {
                                                if (err) {
                                                    throw err;
                                                    console.log(err);
                                                }else{
                                                    // cb(rows);
                                                    callback();
                                                    console.log(query);
                                                    console.log("updated !");
                                                }                       
                                            });

                                        }, function (err) {
                                            if (err) { 
                                                throw err; 
                                            }else{
                                                res.send("finished");
                                                connection.end();
                                                res.redirect('/usuarioslista');
                                                // return cb();
                                            }               
                                        }); 
                                    });
                                });
                            });
                        }else{
                            //si el email ya existe
                            res.render('error',{
                                error: 'El email ingresado ya existe. Intente nuevamente con otro email.'
                            })
                        }
                    }); 
                }else{
                    //si el email ingresado no es valido
                    res.render('error', {
                        error: "Email no válido. Intente nuevamente con un email válido."
                    });
                } 
            }
        }
    });  
}

function getDelUsuario(req, res){
    var params = req.params;
    var id = params.id;

    mVerificacion.getUsuarioFromMovi(id, function (usuarioFromMovi){
        if (usuarioFromMovi[0] != null){
            res.render('error', {
                error: "No puede eliminar este usuario, posee movimientos."
            });
        }else{
            mUsuarios.getUsuarioPorID(id, function (usu){
                usu = usu[0];
                mBorro.add(req.session.user.usuario,"Usuarios", "Borra Nombre Usuario: "+ usu.usuario + ", id: " + id ,function(){
                    mUsuarios.delUsuario(id, function(){
                        mAccesos.cleanAccesos(id, function(){
                            res.redirect('/usuarioslista');
                        });
                    });
                });
            });  
        }
    });
}