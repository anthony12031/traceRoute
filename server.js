'use strict';
var express = require("express");
var app = express();


app.use('/',express.static('cliente'));


app.get('/', function (req, res) {
  res.sendFile(__dirname+'/cliente/home.html');
});


var endPoints = {};
var folder = './traceRouter';
require('fs').readdirSync(folder).forEach((continente)=>{
   const servidores = require(folder+'/'+continente);
   endPoints[continente] = [];
   servidores.forEach(servidor=>{
       app.use('/',servidor.router);
       //nombreServidor:endpoint
       endPoints[continente].push({
           nombre:servidor.nombre,
           url:servidor.endPoint
       });
   })
});
  
app.get('/end-points',(req,res)=>{
    console.log(endPoints);
    res.send(endPoints);
})


var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('app listening on port '+port);
});