var app = angular.module('traceRouter');
app.controller('homeCtrl',['$scope','$http','representacion','mapa','$window',function($scope,$http,representacion,mapa,$window){
   
     
   $scope.continentes = {};
   $scope.servidorSeleccionado = "Seleccione un servidor";
   $scope.continenteSeleccionado = "";
   $scope.site="www.google.com";
   $scope.tiempoEspera;
   mapa.initMap();
   
   
   //obtener los servidores
   $http.get('/end-points')
   .then(res=>{
       console.log(res.data);
      $scope.continentes = res.data;
   },err=>{
       console.log(err);
   });
   
   
   $scope.selectServer = function(serverName,continente){
       $scope.servidorSeleccionado = serverName;
       $scope.continenteSeleccionado = continente;
   }
   
   $scope.getTraza = function(){
      if(!$scope.continenteSeleccionado){
        alert('Seleccione un servidor')
        return;
      }
       $scope.continentes[$scope.continenteSeleccionado].forEach(servidor =>{
           if(servidor.nombre == $scope.servidorSeleccionado){
              console.log($scope.site);
               mapa.limpiar();
                $http.get(servidor.url,{params: {site: $scope.site,tiempoEspera:$scope.tiempoEspera}})
               .then(res=>{
                  $scope.traza = res.data;
                  representacion.representarTraza(res.data);
                  mapa.dibujarMapa(res.data);
               },err=>{
                   console.log(err);
                   alert('error');
               });
           }
       })

   }
   
}])