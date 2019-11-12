console.log(d3)


// function createMap(data){
//
//   let component = d3
//   .select('.s04')
//   .html('<h1>hi flavio</h1>')
//   ;
//
//   return component
// }

function loadData(data){
  d3.json(data).then(data => populateFields(data));
}

loadData('assets/data.json')

function populateFields(data){

  let mainHolder = d3
  .select('#main')
  .data(data.cities)
  .enter()
  ;

  mainHolder
  .select('.s01')
  .html(d => d.city)
  ;
}

function showMap(data){
  d3.json(data).then(data=> createMap(data));
}

showMap('assets/test2.json');


function createMap(data){
  let svgMap = d3.select('.map')
              .append('svg')
              .attr('id', 'map')
              .attr('width','600px')
              .attr('height','600px')
              ;

  const estados = topojson.feature(data, data.objects.BRA2);
  console.log(estados);

    // Get the height and width, in pixels for the SVG element in the document
  const { height, width } = document.getElementById('map').getBoundingClientRect()

  // Create a new projection function
  const projection = d3.geoMercator()
                      .fitExtent([ [ 0, 0 ], [ 600, 600 ] ], estados)
                      ;

  // Create a GeoPath function from the projection
  const path = d3.geoPath()
                .projection(projection)
                ;

  console.log(estados.features[0].geometry.coordinates[0])

  svgMap
  .selectAll("path")
      .data(estados.features)
      .enter()
        .append("path")
          .attr("fill", "#CFD1D5")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("d", path)
          ;

}





//
//
// createMap(data)

// load the data
//
// done
//
// then use data to show map, and all info on left
//
// click on marker, update data on left (filter/select other part of data maybe?)
//
// click on bar, update data on left
