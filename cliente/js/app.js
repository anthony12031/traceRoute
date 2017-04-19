var app = angular.module('traceRouter',['ngRoute','angular-loading-bar', 'ngAnimate']);

//setup routing configuration
app.config(function($routeProvider, $locationProvider){
    
    $locationProvider.html5Mode(true);
     
    $routeProvider.when('/',{
       templateUrl:'../home.html',
       controller:'homeCtrl'
    });
    
});

app.directive('menu',function(){
    return {
      templateUrl:'../menu.html',
      controller:'homeCtrl'
    };
});