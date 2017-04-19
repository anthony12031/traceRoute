
var geoip = require('geoip-lite');

function look(ip){
  
       var geo = geoip.lookup(ip);
       if(!geo)
        return null;
         
       return {
             lat:geo.ll[0],
             lng:geo.ll[1],
             country:geo.country,
         }
        
    
 }    
 
 //console.log(look('66.250.250.9'));
 
 
module.exports = {
 getLocation: function(ip){
  
       var geo = geoip.lookup(ip);
       if(!geo)
        return null;
         
       return {
             lat:geo.ll[0],
             lng:geo.ll[1],
             country:geo.country,
         }
        
    
 }   
}
