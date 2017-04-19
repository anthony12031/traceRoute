'use strict';

const URL = 'https://www.net.princeton.edu/cgi-bin/traceroute.pl';

//const site = "www.google.com";

var express  = require("express");
var router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const geoLocation = require("../../../geoLocation")
const endPoint = '/princeton-university';
var MAXTIME = 10;
var name = 'Estados unidos';


var info = [];
var respuesta ="";
var peticion;

function hacerPeticion(site){
 respuesta ="";
 peticion= request
  .post(URL)
  .form({target:site,cmd:'Go'})
  .on('response', function(response) {
    console.log(response.data) // 200 
    console.log(response.headers['content-type']) // 'image/png' 
  })
  .on('data', function(chunk) {
      respuesta +=chunk.toString('utf8');
    console.log(chunk.toString('utf8')) // 200 
  });
}

function scrape(body){
    
 return new Promise(function(resolve,reject){
      info = [{
        dispName:name
    }]; 

     console.log('extrayendo datos');
     //let route  = $('PRE').text();
     let route = body;
     //quitar espacios blancos al inicio
     route = route.replace(/^\s+/gm,'');
     var arrDatos = route.match(/^\d+.*/gm);
     console.log(arrDatos);
     if (!arrDatos)
        return reject('error');
        
        console.log(arrDatos.length);
        arrDatos.forEach((dato,index,arr) =>{
         
         dato = dato.replace(/^\d+\s*/,'');
         let dispName = dato.match(/.*?\)/g);
         if(dispName){
             dispName = dispName[0];
             var ip = dispName.match(/\(.*\)/g)[0].replace(/\(/,'').replace(/\)/,'');
             var times = dato.match(/([0-9]*\.[0-9]+|[0-9]+)\s*ms/g);
             dispName = dispName.replace(/\(.*\)/,'');
             //quitar espacio y milisegundos
             times.forEach(function(time, index, times) {
                times[index] = parseFloat(times[index].replace(/\s*ms/,''));
             });
             var location = geoLocation.getLocation(ip);
             info.push({
                         dispName: dispName,
                         ip:ip,
                         location:location,
                         times:times
                     });
             } // if dispName
 }); //forEach dato

console.log('info len: '+info.length)

 console.log('sending');
  console.log(info);
  console.log(info.length+' elements')
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
