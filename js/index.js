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
    });
  });  
});
