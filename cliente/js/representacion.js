var app =angular.module('traceRouter');

app.factory('representacion',function(){
    
   var height = 480;
   var width = 640;
   var hDisp = 40;    
   var wDisp = 35; 
   var initialY = 40;
   var initialX = 200;
   var linkDistance = 400;
   var maxNodes = 3;
   var hSpace = 8;
   var vSpace = 150;
   var hNodo = width/15;
   
   
    var areDibujoWidth = $('#areaDibujo').width();
    console.log(areDibujoWidth);
    initialX = areDibujoWidth/2-width/2;
    console.log(initialX);
    var svg = d3.select('#areaDibujo').append('svg')
    .style('background-color','white')
    .style('width','100%')
    .style('border-radius','10px')
    .attr('height', height);
    

    function getX(index){
        var fila = Math.trunc(index/maxNodes);
        //console.log('fila: '+fila);
        var r = (fila%2) ? -1 : 1;
        //console.log(r);
        if(r<0){
            return (initialX + hSpace*(maxNodes-1)*wDisp)- wDisp*(hSpace*(index%maxNodes));
        }
        return initialX + wDisp*(hSpace*(index%maxNodes));
    }
    
    function getY(index){
        return initialY+vSpace*(Math.trunc(index/maxNodes));
    }
    
   function representarTraza(nodos) {
       console.log(nodos);
       const filas = 1+Math.ceil(nodos.length/maxNodes);
       svg.attr('height', filas*vSpace);
       //entrelazar los nodos
       var links = [];
       let ant = 0;
       for(let i = 1;i<nodos.length;i++){
        links.push({ source: ant, target: i });   
        ant++;
       }
     
   var link = svg.selectAll('.link')
    .data(links);
    
    link.enter().append('line')
    .attr('class', 'link')
    .attr('x1', function(d) { return getX(d.source); })
    .attr('y1', function(d) { return getY(d.source); })
    .attr('x2', function(d) { return getX(d.target); })
    .attr('y2', function(d) { return getY(d.target); })
    
    link.exit().remove();

    svg.selectAll(".node").remove();
    var node = svg.selectAll('.node')
    .data(nodos);
    
    node.enter()
    //.append('circle')
    .append("svg:image")
    .attr("xlink:href", function(d,i){ return (i==0 || i==nodos.length-1)?"./server.gif":"./router.jpeg"})
    .attr("width", function(d,i){ return (i==0)?hNodo:hNodo})
    .attr("height",function(d,i){ return (i==0)?hNodo:hNodo})
    .attr("x", function(d,i) { return getX(i)-hNodo/2; })
    .attr("y",function(d,i) { return getY(i)-hNodo/2;; })
    .attr('class', 'node')
    //.attr('r', width/25)
    //.attr('cx', function(d,i) { return getX(i); })
    //.attr('cy', function(d,i) { return getY(i); })
    
    node.exit().remove();
    
    
    svg.selectAll("text").remove();
    var dispName = svg.selectAll('.dispName')
    .data(nodos);
    dispName.enter().append('text')
    .attr('x', function(d,i) { return getX(i); })
    .attr('y', function(d,i) { 
         return getY(i)+hNodo;
    })
    .text(d=>{ return d.dispName })
    .style("text-anchor", "middle")
    .attr('stroke',function(d,i){
        return (i==0 | i==nodos.length-1)?'green':'';
    }) 
    .attr('font-size',"12px") 
    
    
    var ip = svg.selectAll('.ip')
    .data(nodos);
    dispName.enter().append('text')
    .attr('x', function(d,i) { return getX(i); })
    .attr('y', function(d,i) { 
         return getY(i)+hNodo+15;
    })
    .text(d=>{ return d.ip ?"IP: "+d.ip : ''})
    .style("text-anchor", "middle")
       
    var country = svg.selectAll('.ip')
    .data(nodos);
    dispName.enter().append('text')
    .attr('x', function(d,i) { return getX(i); })
    .attr('y', function(d,i) { 
         return getY(i)+hNodo+30;
    })
    .text(d=>{ return d.location ?"Pais: "+d.location.country : ''})
    .style("text-anchor", "middle")
        
    var Tiempo = svg.selectAll('.ip')
    .data(nodos);
    dispName.enter().append('text')
    .attr('x', function(d,i) { return getX(i); })
    .attr('y', function(d,i) { 
         return getY(i)+hNodo+45;
    })
    .text(d=>{return d.times ?'Tiempos(ms): '+d.times : ''})
    .style("text-anchor", "middle")
    
    
    var tiemposPromedios = [];
    var promedioGeneral;
    
    var TiempoPromedio = svg.selectAll('.ip')
    .data(nodos);
    dispName.enter().append('text')
    .attr('x', function(d,i) { return getX(i); })
    .attr('y', function(d,i) { 
         return getY(i)+hNodo+60;
    })
    .text((d,i)=>{
        if(d.times){
        var promedio = d.times.reduce(function(valorAnterior, valorActual, indice, vector){
         return valorAnterior + valorActual;
        },0);
        promedio /= d.times.length;
        tiemposPromedios.push(promedio);
        if((i+1) == nodos.length ){
            promedioGeneral = tiemposPromedios.reduce(function(valorAnterior, valorActual, indice, vector){
         return valorAnterior + valorActual;
        },0);
        promedioGeneral /= (nodos.length-1);
        console.log('promedio General: '+promedioGeneral+' ms');
        
        var PromedioGeneral = svg.selectAll('.ip')
            .data([1]);
            dispName.enter().append('text')
            .attr('x', width/2)
            .attr('y',12)
            .text('Promedio General: '+promedioGeneral.toFixed(3)+' ms')
            .style("text-anchor", "middle")
    
        
        }
        return 'Promedio(ms): '+promedio.toFixed(2);
        }
        return '';
    })
    .style("text-anchor", "middle")
    
    
       
       
   }
    
    return{
        representarTraza:representarTraza
    }
    
});