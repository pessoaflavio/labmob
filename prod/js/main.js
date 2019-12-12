let state_definer;

let div = d3.select('body').append('div').attr('class','tooltip').style('opacity', 0);

function loadData(data){
  d3.json(data).then(data => populateFields(data));
};

// controla preenchimento da ficha lateral
function missingData(data) {
    if (data === 'Dados não disponíveis') {
        let finalstring = '<span style="font-family:\'IBM Plex Mono\';color:#E0375E;font-style:Italic;font-weight:600;font-size:12px">' + data + '</span>'
        return finalstring;
    } else {
        return data;
    }
}

function fillDiv(div,data,extradiv){
  if (extradiv === undefined){
    d3.select(div).html(missingData(data))
  } else {
    d3.select(div).select(extradiv).html(missingData(data))
  }
}

function checkEl(elem){
  return Number.isInteger(elem)
}

function total_veiculos(ref){

  let sum_veiculos = [ref.bicicletas,ref.bicicletas_elétricas,ref.patinetes_elétricos]

  let finalNums = sum_veiculos.filter(elem => checkEl(elem)==true )

  if (checkEl(ref['bicicletas'])==false & checkEl(ref['bicicletas_elétricas'])==false & checkEl(ref['patinetes_elétricos'])==false){
    // console.log(finalNums)
    var veiculos = 'Dados não disponíveis'
    return veiculos
  } else if (finalNums.length == 1) {
    // console.log(finalNums)
    var veiculos = finalNums[0]
    return veiculos
  } else {
    // console.log(finalNums)
    var veiculos = finalNums.reduce((acc, elem) => acc + elem, 0);
    return veiculos
  }
}

function perc_veiculos(ref){

  console.log(ref)
  let sum_veiculos = [ref.bicicletas,ref.bicicletas_elétricas,ref.patinetes_elétricos]

  let finalNums = sum_veiculos.filter(elem => checkEl(elem)==true)

  let cv = sum_veiculos.map(el => {
    if (checkEl(el)==false){
      return 0
    } else {
      return el
    }
  });

  let max = cv[0] + cv[1] + cv[2]

  let x = d3.scaleLinear()
      .domain([0, max])
      .range([0, 100])
  ;

  function widthCalc(x){
    return x + '%'
  }

  console.log(widthCalc(cv[0]))

  d3.select('.graph').insert('div').attr('class', 'bike').style('width',widthCalc(cv[0]))
  d3.select('.graph').insert('div').attr('class', 'pat_el').style('flex-grow',widthCalc(cv[2]))
  d3.select('.graph').insert('div').attr('class', 'bike_el').style('flex-grow',widthCalc(cv[1]))
}



function populateFields(data){

  console.log(data)

  let mainHolder = d3
  .select('.side')
  ;

  mainHolder
  .select('#s01')
  // .append('h3')
  .html('<h3>' + data.local + '</h3>')
  ;

  mainHolder
  .select('.s02')
  .select('span.bignumber')
  .html(data['sistema_total'].length)
  ;

  mainHolder
  .select('.s03')
  .insert('div')
  .attr('class', 'button')
  .html('<a href="sistemas.html">Lista de sistemas</a>')
  ;

  perc_veiculos(data)
  fillDiv('div.s04',data['emissões_de_co2_evitadas'],'.bignumber')
  fillDiv('div#s05_01',data['estações'],'.bignumber')
  fillDiv('div#s05_02',total_veiculos(data),'.bignumber')
  fillDiv('div.keys',data['bicicletas'],'spam.bi')
  fillDiv('div.keys',data['patinetes_elétricos'],'spam.pa')
  fillDiv('div.keys',data['bicicletas_elétricas'],'spam.bc')
  fillDiv('div#s06_01',data['viagens_diárias'],'.bignumber')
  fillDiv('div#s06_03',data['média_distância_percorrida_por_dia'],'.smallnumber')
  fillDiv('div#s07_01',data['usuários'],'.bignumber')
  fillDiv('div#s07_02',data['homens'],'.demodata')
  fillDiv('div#s07_03',data['mulheres'],'.demodata')
  fillDiv('div.s08',data['15_até_29_anos'],'.quinze')
  fillDiv('div.s08',data['30_até_59_anos'],'.trinta')
  fillDiv('div.s08',data['acima_de_60'],'.sessenta')

};

loadData('data/final_file_labmob_v2.json')

// function createMap(data){
//   let svgMap = d3.select('.map')
//               .append('svg')
//               .attr('id', 'map')
//               .attr('width','600px')
//               .attr('height','600px')
//               ;
//
//   const estados = topojson.feature(data, data.objects.BRA2);
//   // console.log(estados);
//
//   // Get the height and width, in pixels for the SVG element in the document
//   const { height, width } = document.getElementById('map').getBoundingClientRect()
//
//   // Create a new projection function
//   const projection = d3.geoMercator().fitExtent([ [ 0, 0 ], [ 600, 600 ] ], estados);
//
//   // Create a GeoPath function from the projection
//   const path = d3.geoPath().projection(projection);
//   // console.log(estados.features[0].geometry.coordinates[0])
//
//   svgMap
//   .selectAll("path")
//       .data(estados.features)
//       .enter()
//         .append("path")
//           .attr("fill", "#CFD1D5")
//           .attr("stroke", "white")
//           .attr("stroke-linejoin", "round")
//           .attr("d", path)
//           ;
//
//   return estados;
// };

// function showMap(data){
//   d3.json(data).then(data=> createMap(data)).then((estados) => displaydots(estados));
// };

// showMap('data/test2.json')

// displaydots = async(estados) => {
//
//   let projection = await d3.geoMercator().fitExtent([ [ 0, 0 ], [ 600, 600 ] ], estados);
//
//   let svg = d3
//     .select('div.map')
//     .select('svg')
//     ;
//
//   function attachDatatoDot(data){
//     svg
//       .selectAll('circle')
//       .data(data)
//       .enter()
//         .append('circle')
//         .attr('class','marker')
//         .attr('id', d => d.cidade)
//         .attr('cx', d => projection([d.long,d.lat])[0])
//         .attr('cy', d => projection([d.long,d.lat])[1])
//         .on('mouseenter',d => {
//
//           div.transition()
//           .duration(200)
//           .style('opacity', 1)
//           ;
//
//           div
//           .html(d.cidade)
//           .style("left", (d3.event.pageX) + "px")
//           .style("top", (d3.event.pageY - 28) + "px")
//           .style('background-color','white')
//           ;
//
//         })
//         .on('mouseleave',d => {
//           div.transition()
//           .duration(200)
//           .style("opacity", 0);
//           div.html('');
//         })
//         ;
//   }
//
//   d3.json('data/final_file_labmob.json').then(data => attachDatatoDot(data.municipios));
//
// }
