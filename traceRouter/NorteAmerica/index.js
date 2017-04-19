'use strict';

let router = require("express").Router();

var servidores = [];
require('fs').readdirSync(__dirname+'/servidores').forEach((servidorFile)=>{
   servidores.push(require('./servidores/'+servidorFile)) ;
});
 
module.exports = servidores;
