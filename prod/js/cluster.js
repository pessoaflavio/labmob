// import {div,loadData,populateFields} from './main.js'

////////////////////////////////////////////////////////////////
////////// Variáveis fixas do Leaflet

//////// Layer rasterizada do Stamen (desativada no momento)
const tonerUrl = "http://{S}tile.stamen.com/toner-lite/{Z}/{X}/{Y}.png";
////////// Função para reduzir referências na URL da Stamen para caixa baixa
const url = tonerUrl.replace(/({[A-Z]})/g, s => s.toLowerCase());
////////// Centro do Brasil!
const latlng = L.latLng(-16, -55);

////////// Definições antigas; aplicar layer rasterizada ao mapa
// var map_layer = new L.StamenTileLayer("toner");
////////// Definições antigas; aplicar layer rasterizada ao mapa
const tiles = L.tileLayer(url, {
  subdomains: ['', 'a.', 'b.', 'c.', 'd.'],
  // minZoom: 0,
  maxZoom: 10,
  detectRetina: true,
  opacity: 0.25,
  type: 'png',
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
});
// latlng = L.latLng(-10, -55);;


////////////////////////////////
////////// Controle de dados

////////// Cálculo de posição de div absoluta na página; usar para marcadores no mapa
function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top , left: rect.left }
}

////////// Controla preenchimento da ficha lateral sem dados
function missingData(data,div,extradiv) {
    if (data === 'Dados não disponíveis') {
        // console.log(div);
        d3.select(div).select('span.red_dot').remove();
        const previous = d3.select(div).select('span.divheader');

        previous
        .append('span')
        .attr('class', 'red_dot')
        .html(' *')
        ;

        if (extradiv===undefined){
          d3.select(div).style('opacity',0);
        } else {
          d3.select(div).select(extradiv).style('opacity',0);
        }
        return '.';

    } else {
      if (extradiv===undefined){
        d3.select(div).style('opacity',1);
      } else {
        d3.select(div).select(extradiv).style('opacity',1);
        d3.select(div).select('span.red_dot').remove();
        if (div==='div.s02'){
          return new Intl.NumberFormat('de-DE').format(data) + ' kg'
        } else if (div==='div.s07_01') {
          return new Intl.NumberFormat('de-DE').format(data) + '%'
        } else if (div==='div.s07_02') {
          return new Intl.NumberFormat('de-DE').format(data) + '%'
        } else {
          return new Intl.NumberFormat('de-DE').format(data)
        }

      }
    }
}

// controla preenchimento de dados inexistentes
function fillDiv(div,data,extradiv){
  if (div === undefined){
    d3.select(div).text(missingData(data,div))
  } else {
    d3.select(div).select(extradiv).text(missingData(data,div,extradiv))
  }
}

// remove a div temporariamente da UI
function removeDiv(div){
  d3.select(div).style('display','none')
}

function showDiv(div,style){
  d3.select(div).style('display',style)
}

function checkModalType(data1,data2,data3) {

  let arrayToCheck = [data1,data2,data3]

  for (var i=0;i<=2;i++){
    if (arrayToCheck[i] === 'Dados não disponíveis') {
      d3.select('div.s05_0' + (i+1)).style('opacity',0.2)
      // removeDiv('div.s05_0' + (i+1))
    } else {
      d3.select('div.s05_0' + (i+1)).style('opacity',1)
      // showDiv('div.s05_0' + (i+1), 'flex')
    }
  }

}

// preenche idades
function fillAge(a1,a2,a3){
  if (a1[1] === 'Dados não disponíveis'){

    d3.select('div.s07_02').select('span.red_dot').remove();

    const previous = d3.select('div.s07_02').select('span.divheader');

    previous
    .append('span')
    .attr('class', 'red_dot')
    .html(' *')
    ;

    d3.select('div.s07_02').select('span.agelist').style('opacity', 0)
    ;

  } else {
    console.log(a1[0],a1[1])
    d3.select('div.s07_02').select('span.red_dot').remove();
    d3.select('div.s07_02').select('span.agelist').style('opacity', 1)
    fillDiv('div.s07_02',a1[1],a1[0])
    fillDiv('div.s07_02',a2[1],a2[0])
    fillDiv('div.s07_02',a3[1],a3[0])
  }

}

let scaleLin = d3.scaleLinear()
    .domain([0, 3000])
    .range([1, 24.5]);

function fillSVGcircles(div,data,full_data){
  console.log(full_data)

  let svg = d3
  .select(div)
  .select('svg')
  ;

  let circle = svg
  .append('circle')
  .attr('cx',25)
  .attr('cy',25)
  ;


  if (div === 'div.s05_01'){
    if (data == null || data == undefined){
      circle
      .attr('r',0)
      ;
    } else {
      circle
      .attr('r',Math.sqrt(scaleLin(data))*3.14)
      .attr('fill','#33D1C4')
      ;
    }
  } else if (div ==='div.s05_02'){
    if (data == null || data == undefined){
      circle
      .attr('r',0)
      ;
    } else {
      circle
      .attr('r',Math.sqrt(scaleLin(data))*3.14)
      .attr('fill','#279BFF')
      ;
    }
  } else if (div ==='div.s05_03'){
    if (data == null || data == undefined){
      circle
      .attr('r',0)
      ;
    } else {
      circle
      .attr('r',Math.sqrt(scaleLin(data))*3.14)
      .attr('fill', '#BFB31C')
      ;
    }

  }

  svg
  .on('mousedown',function(){
    if (div === 'div.s05_01'){
      d3.select('div.side').style('background-color', '#C6F4E8')
    } else if (div ==='div.s05_02'){
      d3.select('div.side').style('background-color', '#D6F1FF')
    } else {
      d3.select('div.side').style('background-color', '#FFFFDD')
    }
  })

}

// preenche tudo lado direito
function fillSidePanel(data,svgchecker,optional_data){
  svgchecker = svgchecker || 1;
  optional_data = optional_data || 0;

  fillDiv('div.s02',data['emissões_de_co2_evitadas'],'.bignumber')


  fillDiv('div.s04',data['veiculos'],'.bignumber')

  fillSVGcircles('div.s05_01',data['bicicletas'],data)
  fillSVGcircles('div.s05_02',data['bicicletas_elétricas'],data)
  fillSVGcircles('div.s05_03',data['patinetes_elétricos'],data)
  fillDiv('div.s05_01',data['bicicletas'],'.smallnumber')
  fillDiv('div.s05_02',data['bicicletas_elétricas'],'.smallnumber')
  fillDiv('div.s05_03',data['patinetes_elétricos'],'.smallnumber')

  fillDiv('div.s06_01',data['viagens_diárias'],'.bignumber')
  fillDiv('div.s06_02',data['média_distância_percorrida_por_dia'],'.bignumber')

  fillDiv('div.s07_01',data['homens'],'.men')
  fillDiv('div.s07_01',data['mulheres'],'.women')
  let ageDiv = {d1: 'span.quinze', d2: 'span.trinta', d3: 'span.sessenta'}
  let ageData = {data1: data['15_até_29_anos'], data2: data['30_até_59_anos'], data3: data['acima_de_60']}
  fillAge([ageDiv.d1, ageData.data1], [ageDiv.d2, ageData.data2], [ageDiv.d3, ageData.data3])
  fillDiv('div.s07_03', data['usuários'],'.bignumber')

}

const myRequest = new Request('data/final_file_labmob_v8.json');

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    console.log(data.municipios)
		var map = L.map('map', {center: latlng, zoom: 4.4, maxZoom: 10, minZoom: 4, zoomDelta: 2
      // , layers: [tiles]
    });

    // var purpleIcon = L.icon({
    // iconUrl: 'img/icon_ball.png',
    // // shadowUrl: 'img/shadow_v2.png',
    // iconSize:     [14, 14], // size of the icon
    // // shadowSize:   [16, 12], // size of the shadow
    // // iconAnchor:   [16, 22], // point of the icon which will correspond to marker's location
    // iconAnchor:   [8, 14], // point of the icon which will correspond to marker's location
    // // shadowAnchor: [0, 10],  // the same for the shadow
    // popupAnchor:  [-8, -5] // point from which the popup should open relative to the iconAnchor
    // });

    // var textIcon = L.divIcon({
    //   className: 'nametip',
    //   html: `<img src="img/icon_ball.png" width="14px" height="14px" ><br>${cidade}`,
    //   iconAnchor:   [8, 14],
    //   popupAnchor:  [-8, -5]
    // })

    const brasil = new Request('data/brazil_new.json')

    let myStyle = {
      'color': 'white',
      'fillColor': '#CFD1D5',
      'opacity': 1,
      'fillOpacity': 1,
      'weight': 1
      // "opacity": 0.65
    };

    const brasil_data = fetch(brasil)
                        .then(response=>response.json())
                        .then(data => L.geoJSON(data,{style: myStyle}).addTo(map));

    // console.log(brasil_data)
    // var markers = L.markerClusterGroup({
    //   chunkedLoading: true,
    //   disableClusteringAtZoom:5,
    //   spiderfyOnMaxZoom:false,
    //   polygonOptions: {
    //     stroke: false,
    //     fill: false
    //     }
    //   }
    // );

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

		// for (var i = 0; i < data.municipios.length; i++) {
		// 	var a = data.municipios[i];
    //   var title = a.cidade
    //   var jovem = a['15_até_29_anos']
    //   var adulto = a['30_até_59_anos']
    //   var idoso = a['acima_de_60']
    //
		// 	// var marker = L.marker(L.latLng(a.lat, a.long), {
    //   //   lat: a.lat,
    //   //   long: a.long,
    //   //   icon: purpleIcon,
    //   //   cidade: a.cidade,
    //   //   sistemas: a.sistemas,
    //   //   emissões_de_co2_evitadas: a.emissões_de_co2_evitadas,
    //   //   estações: a.estações,
    //   //   bicicletas: a.bicicletas,
    //   //   bicicletas_elétricas: a.bicicletas_elétricas,
    //   //   patinetes_elétricos: a.patinetes_elétricos,
    //   //   viagens_diárias: a.viagens_diárias,
    //   //   média_distância_percorrida_por_dia: a.média_distância_percorrida_por_dia,
    //   //   usuários: a.usuários,
    //   //   mulheres: a.mulheres,
    //   //   homens: a.homens,
    //   //   veiculos: total_veiculos(a),
    //   //   '15_até_29_anos': a['15_até_29_anos'],
    //   //   '30_até_59_anos': a['30_até_59_anos'],
    //   //   'acima_de_60': a['acima_de_60'],
    //   //   modais: a.modais
    //   //   });
    //   var marker2 = L.marker(L.latLng(a.lat, a.long), {
    //     lat: a.lat,
    //     long: a.long,
    //     icon: L.divIcon({
    //       className: 'nametip',
    //       html: `<img src="img/icon_ball.png" width="14px" height="14px" ><br>${a.cidade}`,
    //       iconAnchor: [8, 14],
    //       popupAnchor: [-8, -5]
    //     }),
    //     cidade: a.cidade,
    //     sistemas: a.sistemas,
    //     emissões_de_co2_evitadas: a.emissões_de_co2_evitadas,
    //     estações: a.estações,
    //     bicicletas: a.bicicletas,
    //     bicicletas_elétricas: a.bicicletas_elétricas,
    //     patinetes_elétricos: a.patinetes_elétricos,
    //     viagens_diárias: a.viagens_diárias,
    //     média_distância_percorrida_por_dia: a.média_distância_percorrida_por_dia,
    //     usuários: a.usuários,
    //     mulheres: a.mulheres,
    //     homens: a.homens,
    //     veiculos: total_veiculos(a),
    //     '15_até_29_anos': a['15_até_29_anos'],
    //     '30_até_59_anos': a['30_até_59_anos'],
    //     'acima_de_60': a['acima_de_60'],
    //     modais: a.modais
    //     });
		// 	// marker2.bindPopup(title);
		// 	// markers.addLayer(marker);
    //   markers.addLayer(marker2);
    //
		// }

    // map(data.municipios)
    const estados_listados = data.municipios.map(cidade => cidade.estado)
    const estados_unicos = [...new Set(estados_listados)]
    console.log(estados_unicos);

    for (var j = 0; j < estados_unicos.length; j++){
      let grupo_cidades = []
      let current_cities = data.municipios.filter(cidade => cidade.estado == estados_unicos[j])

      for (var i = 0; i < current_cities.length; i++) {
        var a = current_cities[i];

        var icon1 = L.divIcon({
          className: 'cleartip',
          iconSize: [200, 12],
          html: `<img src="img/icon_ball.png" width="10px" height="10px" ><br><span class="nametip">${a.cidade}</span>`,
          iconAnchor: [8, 14],
          popupAnchor: [-8, -5]
        })
        var icon2 = L.divIcon({
          className: 'cleartip',
          iconSize: [200, 12],
          html: `<img src="img/icon_ball.png" width="10px" height="10px" ><br><span class="nametip2">${a.cidade}</span>`,
          iconAnchor: [8, 14],
          popupAnchor: [-8, -5]
        })

        console.log(a)
        var title = a.cidade
        var jovem = a['15_até_29_anos']
        var adulto = a['30_até_59_anos']
        var idoso = a['acima_de_60']
        var marker2 = L.marker(L.latLng(a.lat, a.long), {
          lat: a.lat,
          long: a.long,
          icon: L.divIcon({
            className: 'cleartip',
            iconSize: [200, 12],
            html: `<img src="img/icon_ball.png" width="10px" height="10px" ><br><span class="nametip">${a.cidade}</span>`,
            iconAnchor: [8, 14],
            popupAnchor: [-8, -5]
          }),
          cidade: a.cidade,
          sistemas: a.sistemas,
          emissões_de_co2_evitadas: a.emissões_de_co2_evitadas,
          estações: a.estações,
          bicicletas: a.bicicletas,
          bicicletas_elétricas: a.bicicletas_elétricas,
          patinetes_elétricos: a.patinetes_elétricos,
          viagens_diárias: a.viagens_diárias,
          média_distância_percorrida_por_dia: a.média_distância_percorrida_por_dia,
          usuários: a.usuários,
          mulheres: a.mulheres,
          homens: a.homens,
          veiculos: total_veiculos(a),
          '15_até_29_anos': a['15_até_29_anos'],
          '30_até_59_anos': a['30_até_59_anos'],
          'acima_de_60': a['acima_de_60'],
          modais: a.modais
          });
          console.log(marker2.options.icon.options.html)
  			// marker2.bindPopup(title);
  			// markers.addLayer(marker);
        grupo_cidades.push(marker2);

  		}
      var estados = L.layerGroup(grupo_cidades);
      console.log(grupo_cidades)

      var markers = L.markerClusterGroup({
        chunkedLoading: true,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom:6,
        spiderfyOnMaxZoom:false,
        polygonOptions: {
          stroke: false,
          fill: false
          }
        }
      );
      markers.on('mousedown',function(e){
        d3.select('div.s04_00').html('')

        d3.select('div.side').style('background-color', '#DFEFEB');

        for (var i=0;i<=2;i++){
            d3.select('div.s05_0' + (i+1)).style('opacity',1)
        }

        d3.select('div#s01').html(`<h3>${e.layer.options.cidade}</h3>`)

        let mData = e.layer.options
        let s = mData.sistemas;
        let lista_veiculo = [mData.bicicletas,mData.bicicletas_elétricas,mData.patinetes_elétricos]

        d3.selectAll('.button').remove()
        d3.selectAll('.bike').remove()
        d3.selectAll('.bike_el').remove()
        d3.selectAll('.pat_el').remove()
        d3.selectAll('circle').remove()

        // 03 LAYER TODOS
        d3.select('div.s03').insert('div').attr('class', 'button').html('Todos').on('click',function(){
          removeDiv('div.s07');
          d3.select('div.s04_00').html('')

          for (var i=0;i<=2;i++){
              d3.select('div.s05_0' + (i+1)).style('opacity',1)
          }

          d3.select('div.side').style('background-color', '#DFEFEB');

          let currentDivText = d3.select(this).text();
          d3.selectAll('circle').remove()
          d3.selectAll('.button')
            .classed('active', (d, i, nodes) => {
              const node = d3.select(nodes[i]);
              const node_text = node._groups[0][0].textContent;
              console.log(currentDivText);
              console.log(node_text);
              if (node_text === currentDivText) {
                  return true } else {
                  return false
                }
            }
          )

          fillSidePanel(mData);

        })

        // 02 LAYER DE SISTEMAS
        for (var j=0; j<s.length;j++){

          let sist = s[j];
          console.log(sist)

          let veiculo_sistema = total_veiculos(sist);
          let co2 = sist.emissões_de_co2_evitadas;
          let estacoes = sist.estações;
          let bici = sist.bicicletas;
          let b_ele = sist.bicicletas_elétricas;
          let pat = sist.patinetes_elétricos;
          let viagens = sist.viagens_diárias;
          let dist = sist.média_distância_percorrida_por_dia;
          let usuarios = sist.usuários;
          let mul = sist.mulheres;
          let hom = sist.homens;
          sist.transp = sist.veiculos;
          sist.veiculos = veiculo_sistema;
          let jovens = sist['15_até_29_anos'];
          let adultos = sist['30_até_59_anos'];
          let idosos = sist['acima_de_60']

          d3.select('div.s03').insert('div').attr('class', 'button').html(sist.sistema).on('mousedown',function(){

            checkModalType(bici,b_ele,pat);

            d3.select('div.s04_00').html('')
            d3.select('div.side').style('background-color', '#DFEFEB');
            d3.selectAll('circle').remove()
            let currentDivText = d3.select(this).text();

            d3.select('div.s04_00').html(`<span class="divheader">Estações</span>
            <span class="bignumber"></span>`)

            fillDiv('div.s04_00',estacoes,'.bignumber')

            d3.selectAll('.button')
              .classed('active', (d, i, nodes) => {
                const node = d3.select(nodes[i]);
                const node_text = node._groups[0][0].textContent;
                console.log(currentDivText);
                console.log(node_text);
                if (node_text === currentDivText) {
                    return true } else {
                    return false
                  }
              }
            )
            showDiv('div.s07','flex')



            fillSidePanel(sist)


          })

        }

        // 01 PRIMEIRO LAYER DE DADOS DA CIDADE
        fillSidePanel(mData);
        removeDiv('div.s07');

      });
      markers.on('clusterclick', function (a) {
      	// a.layer is actually a cluster
        console.log(a.layer);
        a.layer.zoomToBounds({padding: [20, 20]});
      	// console.log('cluster ' + a.layer.getAllChildMarkers().length);
      });
      // markers.on('mouseover',function(e){
      //   // console.log(e.layer)
      //   // e.layer.setIcon(icon2)
      //   e.layer.setZIndexOffset(1000)
      //
      // });
      // markers.on('mouseout',function(e){
      //   // console.log(e.layer)
      //   // e.layer.setIcon(icon1)
      //   e.layer.setZIndexOffset(0)
      //
      // });
      markers.addLayer(estados);
      map.addLayer(markers);
    }
    // console.log(city_holder)

    markers.on('mousedown',function(e){

      d3.select('div.s04_00').html('')

      d3.select('div.side').style('background-color', '#DFEFEB');

      for (var i=0;i<=2;i++){
          d3.select('div.s05_0' + (i+1)).style('opacity',1)
      }

      d3.select('div#s01').html(`<h3>${e.layer.options.cidade}</h3>`)

      let mData = e.layer.options
      let s = mData.sistemas;
      let lista_veiculo = [mData.bicicletas,mData.bicicletas_elétricas,mData.patinetes_elétricos]

      d3.selectAll('.button').remove()
      d3.selectAll('.bike').remove()
      d3.selectAll('.bike_el').remove()
      d3.selectAll('.pat_el').remove()
      d3.selectAll('circle').remove()

      // 03 LAYER TODOS
      d3.select('div.s03').insert('div').attr('class', 'button').html('Todos').on('click',function(){
        removeDiv('div.s07');
        d3.select('div.s04_00').html('')

        for (var i=0;i<=2;i++){
            d3.select('div.s05_0' + (i+1)).style('opacity',1)
        }

        d3.select('div.side').style('background-color', '#DFEFEB');

        let currentDivText = d3.select(this).text();
        d3.selectAll('circle').remove()
        d3.selectAll('.button')
          .classed('active', (d, i, nodes) => {
            const node = d3.select(nodes[i]);
            const node_text = node._groups[0][0].textContent;
            console.log(currentDivText);
            console.log(node_text);
            if (node_text === currentDivText) {
                return true } else {
                return false
              }
          }
        )

        fillSidePanel(mData);

      })

      // 02 LAYER DE SISTEMAS
      for (var j=0; j<s.length;j++){

        let sist = s[j];
        console.log(sist)

        let veiculo_sistema = total_veiculos(sist);
        let co2 = sist.emissões_de_co2_evitadas;
        let estacoes = sist.estações;
        let bici = sist.bicicletas;
        let b_ele = sist.bicicletas_elétricas;
        let pat = sist.patinetes_elétricos;
        let viagens = sist.viagens_diárias;
        let dist = sist.média_distância_percorrida_por_dia;
        let usuarios = sist.usuários;
        let mul = sist.mulheres;
        let hom = sist.homens;
        sist.transp = sist.veiculos;
        sist.veiculos = veiculo_sistema;
        let jovens = sist['15_até_29_anos'];
        let adultos = sist['30_até_59_anos'];
        let idosos = sist['acima_de_60']

        d3.select('div.s03').insert('div').attr('class', 'button').html(sist.sistema).on('mousedown',function(){

          checkModalType(bici,b_ele,pat);

          d3.select('div.s04_00').html('')
          d3.select('div.side').style('background-color', '#DFEFEB');
          d3.selectAll('circle').remove()
          let currentDivText = d3.select(this).text();

          d3.select('div.s04_00').html(`<span class="divheader">Estações</span>
          <span class="bignumber"></span>`)

          fillDiv('div.s04_00',estacoes,'.bignumber')

          d3.selectAll('.button')
            .classed('active', (d, i, nodes) => {
              const node = d3.select(nodes[i]);
              const node_text = node._groups[0][0].textContent;
              console.log(currentDivText);
              console.log(node_text);
              if (node_text === currentDivText) {
                  return true } else {
                  return false
                }
            }
          )
          showDiv('div.s07','flex')



          fillSidePanel(sist)


        })

      }

      // 01 PRIMEIRO LAYER DE DADOS DA CIDADE
      fillSidePanel(mData);
      removeDiv('div.s07');

    })

    // // adicionar nome da cidade por cima do marker com mouse
    // markers.on('mouseover',function(e){
    //   console.log(e.layer)
    //   // let mData = e.layer.options;
    //   // let cidade = mData.cidade;
    //   //
    //   // let currentLat = mData.lat;
    //   // let currentLong = mData.long;
    //   //
    //   // let replacePx = str => str.replace('px','');
    //   //
    //   // let map_left = d3.select('div#map').style('left');
    //   // let map_top = d3.select('div#map').style('top');
    //   //
    //   // let coordPoints = map.latLngToContainerPoint([currentLat, currentLong]);
    //   //
    //   // let cityName = d3
    //   // .select('body')
    //   // .append('div')
    //   // .attr('class', 'nametip')
    //   // .html(cidade)
    //   // ;
    //   //
    //   // var mapdiv = document.getElementById("map");
    //   // let divOffset = offset(mapdiv);
    //   //
    //   // let stringX = cityName.style('width');
    //   // let clearX = stringX.replace('px','')
    //   // let finalX = (coordPoints.x + divOffset.left) - Number(clearX)/2
    //   // let finalY = (coordPoints.y + 100)
    //   //
    //   //
    //   // cityName
    //   // .style('left', finalX + 'px')
    //   // .style('top', finalY + 'px')
    //   // ;
    //
    // })
    //
    // // retirar nome da cidade por cima do marker com mouse
    // markers.on('mouseout',function(e){
    //
    //   let mData = e.layer.options
    //   let cidade = mData.cidade;
    //
    //   d3
    //   .select('div.nametip')
    //   .remove()
    //
    // })

    // adicionar markers no mapa!
		// map.addLayer(markers);

    }
  )
  ;
