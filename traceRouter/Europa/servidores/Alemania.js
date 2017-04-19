'use strict';

const URL = 'https://noc.gaertner.de/cgi-bin/looking-glass.cgi';
var name = 'Alemania';

var express  = require("express");
var router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const endPoint = '/'+name;
const geoLocation = require("../../../geoLocation");
var info = [];
var MAXTIME = 5;

var info = [];
var respuesta ="";
var peticion;

function hacerPeticion(site){
 respuesta ="";
 peticion= request
  .post({url:URL})
  .form({type:'traceroute',dest:site,Action:'Go!'})
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
            console.log('-----------time----------------');
            console.log(respuesta);
            scrape(respuesta)
            .then(info =>{
              
            })
            .catch(err=>{
              
            })
        },MAXTIME*1000);
}


//test('181.130.66.106');


var ipExpresion = /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g;
var timeExpresion = /[0-9]+\s*ms/g;

function scrape(body,site){
    
 return new Promise(function(resolve,reject){
    info = [{
        dispName:name
    }]; 

     let route = body;
     var ips = [];
     var times = [];
     console.log('ROUTE');
     var hops = route.match(/\s+\d+\s+[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+.*/gm);
     console.log(hops);
     //obtener la informacion de cada hop
     hops.forEach((hop,i,arr)=>{
         ips.push(arr[i].match(ipExpresion)[0]);
         var tempTimes = hop.match(/[0-9]+\.[0-9]+\s+ms/g)
         tempTimes.forEach((time,i,arr)=>{
             arr[i] = parseFloat(time.replace(/\s+ms/,''));
         });
         times.push(tempTimes);
     })
     //console.log(ips)
     //console.log(times);
     var arrDatos = ips;
     if (!arrDatos)
        return reject('error');
        arrDatos.forEach((dato,index,arr) =>{
             var ip = dato;
             var location = geoLocation.getLocation(ip);
             info.push({
                         ip:ip,
                         location:location,
                         times:times[index]
                     });
 }); //forEach dato

console.log('sending')
console.log(info);

//console.log('info len: '+info.length)

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
            scrape(respuesta,req.query.site
            )
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
