var width = 1000;
var height = 600;


var projection = d3.geo.mercator()
                       .translate([width/2, height/2])
                       .scale(200000)
                       .center([-58.3817,-34.6033]);

//Define path generator
var path = d3.geo.path()
                 .projection(projection);

var zoom = d3.behavior.zoom()
              .scaleExtent([1, 10])
              .scale(5)
              .on("zoom", redraw);
// selection.call(zoom);
// var zoom = d3.behavior.zoom()

//     .translate([0,0])               // not linked directly to projection
//     .on("zoom", redraw);

var svg = d3.select('#map')
            .append('svg')
              .attr('width', width)
              .attr('height', height);

var wrapper = svg.append('g')
                .classed('wrapper', true)
                .call(zoom);


var dsv = d3.dsv(";", "text/plain");
dsv("calles-sentido.csv", function(data) {

  data.forEach(function(d) {

    d.geojson = JSON.parse(d.geojson);

    wrapper.append("path")
      .datum(d.geojson)
      .attr("d", path)
      .attr("class", d.tipo_c.toLowerCase());

  });

  // redraw();
});



var tlast = [0,0], 
    slast = null;

function redraw() {
    if (d3.event) { 
        var scale = d3.event.scale,
            t = d3.event.translate;                
        
        // // if scaling changes, ignore translation (otherwise touch zooms are weird)
        // if (scale != slast) {
        //   console.log(scale);
        //     projection.scale(scale);
        // } else {
        //     var dx = t[0]-tlast[0],
        //         dy = t[1]-tlast[1],
        //         yaw = projection.rotate()[0],
        //         tp = projection.translate();
        
        //     // use x translation to rotate based on current scale
        //     projection.rotate([yaw+360.*dx/width*scaleExtent[0]/scale, 0, 0]);
        //     // use y translation to translate projection, clamped by min/max
        //     var b = mercatorBounds(projection, maxlat);
        //     if (b[0][1] + dy > 0) dy = -b[0][1];
        //     else if (b[1][1] + dy < height) dy = height-b[1][1];
        //     projection.translate([tp[0],tp[1]+dy]);
        // }
        // // save last values.  resetting zoom.translate() and scale() would
        // // seem equivalent but doesn't seem to work reliably?
        // slast = scale;
        // tlast = t;

        wrapper.attr("translate","scale("+ scale +")");
    }
    
//     wrapper.selectAll('path')       // re-project path data
//         .attr('d', path);
}