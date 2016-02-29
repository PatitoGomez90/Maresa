//requiriendo modelo mensaje.js:
var mAccesos = require('../models/mAccesos');

module.exports = {
  getAccesos: getAccesos,
  postAccesos: postAccesos
}
function getAccesos(req, res){
  params = req.params;
  idusuario = params.id;  
  mAccesos.getMenues(function (menues){
    console.log(menues.length)
    mAccesos.getAccesos(function (accesos){
      mAccesos.getAccesosPorUsuario(idusuario, function (accesosxusuario){
        console.log(accesosxusuario.length)
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



// function getAccesos(req, res){
//   params = req.params;
//   idusuario = params.id;  
//   mAccesos.getMenues(function (menues){
//     //console.log(menues.length)
//     mAccesos.getAccesos(function (accesos){
//       mAccesos.getAccesosPorUsuario(idusuario, function (accesosxusuario){
//         console.log(accesosxusuario.length)
//         if ( menues.length == accesosxusuario.length){
//           res.render('accesoslista', {
//             idUsuario: idusuario,
//             pagename: 'Lista de Accesos',
//             menues: menues,
//             accesos: accesos,
//             usuario_accesos: accesosxusuario
//           });  
//         }else{
//           //var arJ1 = [{a:1},{a:2}, {a:3}, {a:4}, {a:5}];
//           //var arJ2 = [{a:1}, {a:3}, {a:2}];
//           var band = false;
//           var noEsta = [];

//           menues.forEach(function (e) {
//             accesosxusuario.forEach(function (d) {
//               if ( e.id == d.menu ) {
//                 band = true
//               } 
//             });
//             if (!band) {
//               mAccesos.insertAcceso(idusuario, e.id, function (data){
//                 mAccesos.getMenues(function (menues){
//                   mAccesos.getAccesos(function (accesos){
//                     mAccesos.getAccesosPorUsuario(idusuario, function (accesosxusuario){
//                       res.render('accesoslista', {
//                         idUsuario: idusuario,
//                         pagename: 'Lista de Accesos',
//                         menues: menues,
//                         accesos: accesos,
//                         usuario_accesos: accesosxusuario
//                       }); 
//                     });
//                   });
//                 });
//               });
//               console.log("No esta: " + e.id);
//               noEsta.push(e.a);
//             }
//             band = false;
//           }); 
//         }                
//       }); 
//     });    
//   });
// }

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