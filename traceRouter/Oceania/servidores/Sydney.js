'use strict';

const URL = 'http://looking-glass.connect.com.au/lg/';
var name = 'Sydney';

var express  = require("express");
var router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const endPoint = '/'+name;
const geoLocation = require("../../../geoLocation");
var info = [];
var MAXTIME = 10;

var info = [];
var respuesta ="";
var peticion;


function hacerPeticion(site){
  
 respuesta ="";
 peticion= request
  .post({url:URL})
  .form({query:'trace',protocol:'IPv4',addr:site,router:'Sydney'})
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
            scrape(respuesta,site)
            .then(info =>{
              
            })
            .catch(err=>{
              
            })
        },MAXTIME*1000);
}

//test('www.google.com');


var ipExpresion = /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g;
var timeExpresion = /[0-9]+\s*ms/g;

function scrape(body,site){
    
 return new Promise(function(resolve,reject){
    info = [{
        dispName:name
    }]; 

     let route = body;
     console.log(route.match(/\[.*\]/gm))
     route = route.replace(/\[.*\]/gm,'');
     console.log(route);
     var ips = [];
     var times = [];
     var dispNames  = [];
     console.log('ROUTE');
     var hops = route.match(/\s*\d+\s+.*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+).*/gm);
     console.log(hops);
     hops.forEach((hop,i,arr)=>{
        // console.log(hop);
         var tempIP = arr[i].match(ipExpresion);
        // console.log('ip: '+tempIP);
         ips.push(tempIP ? tempIP[0]:'');
         var tempTimes = hop.match(/[0-9]+\s+msec/g)
        // console.log(tempTimes);
         tempTimes.forEach((time,i,arr)=>{
             arr[i] = parseFloat(time.replace(/\s+msec/,''));
         });
         times.push(tempTimes);
         var tempName = hop.match(/\d+\s+.*\s+\(/g);
         if(tempName){
             var tempName = tempName[0].replace(/^\d+\s+/,'').replace(/\s+\(/,'');
             //console.log('name ');
             //console.log(tempName);
             dispNames.push(tempName);
         }
         else{
             dispNames.push('');
         }
    
         
         
     })
     
     
     var arrDatos = ips;
     //console.log(arrDatos);
     if (!arrDatos)
        return reject('error');
        arrDatos.forEach((dato,index,arr) =>{
             var ip = dato;
             var location = geoLocation.getLocation(ip);
             info.push({
                         dispName: dispNames[index],
                         ip:ip,
                         location:location,
                         times:times[index]
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
            scrape(respuesta,req.query.site)
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
