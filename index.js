var width = 1000;
var height = 600;

var svg = d3.select('#map')
            .append('svg')
              .attr('width', width)
              .attr('height', height);

var projection_position = [width/2, height/2];
var projection = d3.geo.mercator()
                       .translate(projection_position)
                       .scale(200000)
                       .center([-58.3817,-34.6033]);

var path = d3.geo.path()
                 .projection(projection);

var zoom = d3.behavior.zoom()
              .translate(projection.translate())
              .scale(projection.scale())
              .scaleExtent([100000, 2000000])
              .on("zoom", redraw);

var wrapper = svg.append('g')
              .attr("width", width)
              .attr("height", height)
              .classed('wrapper', true)
              .call(zoom);


var dsv = d3.dsv(";", "text/plain");
dsv("calles-sentido.csv", function(data) {

  data.forEach(function(d) {

    d.geojson = JSON.parse(d.geojson);

    wrapper.append("path")
      .datum(d.geojson)
      .attr("d", path)
      .attr("class",d.tipo_c.toLowerCase() + ' ' + d.sentido.toLowerCase())
      .on("click", clicked);

  });
});

function clicked(d) {
  var centroid = projection.invert(d3.mouse(this));
      translate = projection.translate();

  projection.center(centroid).scale(2000000);

  zoom.translate(projection(centroid)).scale(2000000);

  wrapper.selectAll("path").transition()
      .duration(700)
      .attr("d", path);
}


function redraw() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
  wrapper.selectAll("path").attr("d", path);
}