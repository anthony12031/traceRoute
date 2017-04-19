'use strict';

const URL = 'https://registro.br/cgi-bin/nicbr/trt';
var name = 'brasil';

var express  = require("express");
var router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const endPoint = '/'+name;
const geoLocation = require("../../../geoLocation");
var info = [];
var MAXTIME = 20;

var info = [];
var respuesta ="";
var peticion;

function hacerPeticion(site){
 respuesta ="";
 peticion= request
  .post({url:URL})
  .form({HOST:site})
  .on('response', function(response) {
    console.log(response.data) // 200 
    console.log(response.headers['content-type']) // 'image/png' 
  })
  .on('data', function(chunk) {
      respuesta +=chunk.toString('utf8');
    console.log(chunk.toString('utf8')) // 200 
  });
}

function test(site){
     hacerPeticion(site);
      setTimeout(function(){
            //cancelar la peticion;
            peticion.abort();
            scrape(respuesta)
            .then(info =>{
              
            })
            .catch(err=>{
              
            })
        },MAXTIME*1000);
}

//test('www.facebook.com');



var ipExpresion = /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g;

function scrape(body){
    
 return new Promise(function(resolve,reject){
    info = [{
        dispName:name
    }]; 
     let route = body;
     var ips = route.match(ipExpresion);
     var arrDatos = ips;
     //console.log(arrDatos);
     if (!arrDatos)
        return reject('error');
        arrDatos.forEach((dato,index,arr) =>{
             var dispName = dato;
             var ip = dato;
             var location = geoLocation.getLocation(ip);
             info.push({
                         dispName: dispName,
                         ip:ip,
                         location:location
                     });
 }); //forEach dato

  console.log('sending');
  console.log(info);

return resolve(info);

 });  //promise 
} //scrape
//scrape("www.openenglish.com");


router.get(endPoint,function(req,res){
    
    if(req.query.site){
        if(req.query.tiempoEspera)
            MAXTIME=req.query.tiempoEspera;
        hacerPeticion(req.query.site);
        setTimeout(function(){
            //cancelar la peticion;
            peticion.abort();
            console.log('-----------time----------------');
            console.log(respuesta);
            scrape(respuesta)
            .then(info =>{
                console.log('snding');
                console.log(info);
                res.send(info);
            })
            .catch(err=>{
                console.log(err);
                res.status(500).send(err);
            })
        },MAXTIME*1000);
        
    }
});

module.exports = {
    router:router,
    endPoint:endPoint,
    nombre:name
}
