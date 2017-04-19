var app =angular.module('traceRouter');

app.factory('mapa',function($timeout){
    
    var map;
    var markers = [];
    var enlaces = [];
    var caminoEnlaces;
    
    function dibujarMapa(nodos){
        limpiar();
        caminoEnlaces = new google.maps.Polyline({
                path: [],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
              caminoEnlaces.setMap(map);
              
        nodos.forEach((nodo,i)=>{
           if(nodo.location){
               dibujarMarker(nodo,i*400);
               enlaces.push({lat:nodo.location.lat,lng:nodo.location.lng})
           }
        });
       // dibujarEnlaces(nodos);
    }
 
    
    function dibujarMarker(nodo,timeout){
     if(nodo.location){ 
          $timeout(function(){
                var marker = new google.maps.Marker({
                position: nodo.location,
                //label:nodo.ip,
                //animation: google.maps.Animation.DROP,
                  map: map,
              }); 
               map.panTo(nodo.location);
              var latlng = new google.maps.LatLng(nodo.location.lat, nodo.location.lng);
              //console.log(latlng);
			  caminoEnlaces.getPath().push(latlng);
              
              markers.push(marker);
          },timeout);
     }
    }
    
  
    
    function limpiar(){
        for(let i=0;i<markers.length;i++){
            markers[i].setMap(null);
        }
       
       
        if(caminoEnlaces)
        caminoEnlaces.setMap(null);
        enlaces = [];
        markers=[];
    }
    
    
    function dibujarEnlaces(nodos){
        caminoEnlaces = new google.maps.Polyline({
        path: enlaces,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
    
      caminoEnlaces.setMap(map);
    }
    
    function initMap(){
          map = new google.maps.Map(document.getElementById('areaMapa'), {
            zoom: 3,
            center: {lat: 4, lng: -74}
           // mapTypeId: google.maps.MapTypeId.HYBRID
          });
          var myLatLng = {lat: -25.363, lng: 131.044};
    }
    
    return{
        dibujarMapa:dibujarMapa,
        initMap:initMap,
        limpiar:limpiar
    }
    
});