//http://blog.rusty.io/2012/09/17/crossfilter-tutorial/ for better understanding of crossfilter
var search = document.getElementById('search');
search.addEventListener('click', function(){
  var director = document.getElementById('director').value.trim();
  var details = fetch("http://netflixroulette.net/api/api.php?director="+director);
  details.then(function(response){
    response.json().then(function(res){
      console.log(res);
      var container = document.getElementById('charts');
      var data = crossfilter(res);
      var ratingDimension = data.dimension(function(d) {return d.rating;});
      var group = function(p){ return "movies"};
      //table creation : to show movies of director     
      var table = new dc.dataTable('#table');
      table.columns([
          function(d) { return d.category },
          function(d) { return d.show_title},
          function(d) { return d.release_year},
          function(d) { return d.rating }
        ]);
      table.dimension(ratingDimension);
      table.group(group);
      table.render();
     
     //pie chart : to show categogies of movies director did
     var catDimension = data.dimension(function(d) {return d.category}); 
     var catGroup = catDimension.group().reduceCount();
     var pie = new dc.pieChart('#chart');
     pie.dimension(catDimension);
     pie.group(catGroup);
     pie.render();

     //Bar Chart 
     var bar = new dc.barChart('#bar-chart');
     var nameDimention = data.dimension(function(d){return d.show_title});
     debugger
     var ratingGroup = nameDimention.group().reduceSum(function(d){
      return d.rating;
     });    
     bar.dimension(nameDimention);
     bar.group(ratingGroup);
     bar.gap(3);
  
     bar.x(d3.scale.ordinal());//use ordinal scale whenever u are not dealing with the set of real numbers or series of numbers which are not so random. https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md
     bar.xUnits(dc.units.ordinal); //to tell dc that using ordinal scale    
     bar.width(500);
     bar.height(500);
     
     bar.render();
    });
  });  
});
 