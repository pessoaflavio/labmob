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
// var layer = new L.StamenTileLayer("toner");
////////// Definições antigas; aplicar layer rasterizada ao mapa
// const tiles = L.tileLayer(url, {
//   subdomains: ['', 'a.', 'b.', 'c.', 'd.'],
//   // minZoom: 0,
//   maxZoom: 7,
//   detectRetina: true,
//   opacity: 0.35,
//   type: 'png',
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
// }),
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

// MODIFICAR REGRA // MODIFICAR REGRA // MODIFICAR REGRA // MODIFICAR REGRA
////////// Controla preenchimento da ficha lateral sem dados
function missingData(data,div,extradiv) {
    if (data === 'Dados não disponíveis') {
        // console.log(div);
        d3.select(div).select('span.red_dot').remove();

        const previous = d3.select(div).select('p');

        console.log(previous);

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
      }
        d3.select(div).select('span.red_dot').remove();
        return data;
    }
}

// MODIFICAR REGRA // MODIFICAR REGRA // MODIFICAR REGRA // MODIFICAR REGRA
// controla preenchimento de dados inexistentes
function fillDiv(div,data,extradiv){
  if (extradiv === undefined){
    d3.select(div).text(missingData(data,div))
  } else {
    d3.select(div).select(extradiv).text(missingData(data,div,extradiv))
  }
}

///////// Função para checar estado do botão
// function checkButtonState(this,d,i,nodes){
//
//   let currentDivText = d3.select(this).text();
//
//   d3.selectAll('.button')
//     .classed('active', (d, i, nodes) => {
//       const node = d3.select(nodes[i]);
//       const node_text = node._groups[0][0].textContent;
//       console.log(currentDivText);
//       console.log(node_text);
//       if (node_text === currentDivText) {
//           return true } else {
//           return false
//         }
//     }
//   )
// }



const myRequest = new Request('data/final_file_labmob_v2.json');

fetch(myRequest)
  .then(response => response.json())
  .then(data => {

    console.log(data.municipios)

		var map = L.map('map', {center: latlng, zoom: 4.4, maxZoom: 8, minZoom: 4
      // , layers: [tiles]
    });

    var purpleIcon = L.icon({
    iconUrl: 'img/icon_v2.png',
    shadowUrl: 'img/shadow_v2.png',

    iconSize:     [16, 22], // size of the icon
    shadowSize:   [16, 12], // size of the shadow
    // iconAnchor:   [16, 22], // point of the icon which will correspond to marker's location
    iconAnchor:   [8, 22], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 10],  // the same for the shadow
    popupAnchor:  [-8, -5] // point from which the popup should open relative to the iconAnchor
    });

		var markers = L.markerClusterGroup({ chunkedLoading: true, disableClusteringAtZoom:5,spiderfyOnMaxZoom:false });

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

		for (var i = 0; i < data.municipios.length; i++) {
			var a = data.municipios[i];
      var title = a.cidade
      var jovem = a['15_até_29_anos']
      var adulto = a['30_até_59_anos']
      var idoso = a['acima_de_60']

			var marker = L.marker(L.latLng(a.lat, a.long), {
        lat: a.lat,
        long: a.long,
        icon: purpleIcon,
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
        'acima_de_60': a['acima_de_60']
        });
			marker.bindPopup(title);
			markers.addLayer(marker);

		}

    markers.on('mousedown',function(e){

      d3.select('div#s01').html('<h3>' + e.layer.options.cidade + '</h3>')

      let mData = e.layer.options
      let s = mData.sistemas;

      d3.select('div.s02').select('.bignumber').html(s.length)

      let lista_veiculo = [mData.bicicletas,mData.bicicletas_elétricas,mData.patinetes_elétricos]

      d3.selectAll('.button').remove()
      d3.selectAll('.bike').remove()
      d3.selectAll('.bike_el').remove()
      d3.selectAll('.pat_el').remove()
      //insert todos
      d3.select('div.s03').insert('div').attr('class', 'button').html('Todos').on('click',function(){


        let currentDivText = d3.select(this).text();

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

        console.log(mData);
        perc_veiculos(mData)
        fillDiv('div.s04',(mData['emissões_de_co2_evitadas']+' kg'),'.bignumber')
        fillDiv('div#s05_01',mData['estações'],'.bignumber')
        fillDiv('div#s05_02',mData['veiculos'],'.bignumber')
        fillDiv('div#s06_01',mData['viagens_diárias'],'.bignumber')
        fillDiv('div#s06_03',mData['média_distância_percorrida_por_dia'],'.smallnumber')
        fillDiv('div#s07_01',mData['usuários'],'.bignumber')
        fillDiv('div#s07_02',mData['homens'],'.demodata')
        fillDiv('div#s07_03',mData['mulheres'],'.demodata')
        fillDiv('div.s08',mData['15_até_29_anos'],'.quinze')
        fillDiv('div.s08',mData['30_até_59_anos'],'.trinta')
        fillDiv('div.s08',mData['acima_de_60'],'.sessenta')
      })
      //insert all other systems
      for (var j=0; j<s.length;j++){

        let sist = s[j];
        console.log(sist)

        let veiculo_sistema = total_veiculos(sist);
        // let title = sist.title;
        // let sis = sist.a.sistemas;
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
        let veiculos = veiculo_sistema;
        let jovens = sist['15_até_29_anos'];
        let adultos = sist['30_até_59_anos'];
        let idosos = sist['acima_de_60']
        // d3.selectAll('.button').remove()
        d3.select('div.s03').insert('div').attr('class', 'button').html(sist.sistema).on('click',function(){

          let currentDivText = d3.select(this).text();

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



          // d3.select('.button').remove()
          perc_veiculos(sist)
          // d3.select('div.s03').insert('div').attr('class', 'button').html('Todos').on('click',function(mData){
          //   console.log(mData);
          //   perc_veiculos(mData)
          //   fillDiv('div.s04',mData['emissões_de_co2_evitadas'],'.bignumber')
          //   fillDiv('div#s05_01',mData['estações'],'.bignumber')
          //   fillDiv('div#s05_02',mData['veiculos'],'.bignumber')
          //   fillDiv('div#s06_01',mData['viagens_diárias'],'.bignumber')
          //   fillDiv('div#s06_03',mData['média_distância_percorrida_por_dia'],'.smallnumber')
          //   fillDiv('div#s07_01',mData['usuários'],'.bignumber')
          //   fillDiv('div#s07_02',mData['homens'],'.demodata')
          //   fillDiv('div#s07_03',mData['mulheres'],'.demodata')
          //   fillDiv('div#s07_03',mData['mulheres'],'.demodata')
          //   fillDiv('div.s08',mData['15_até_29_anos'],'.quinze')
          //   fillDiv('div.s08',mData['30_até_59_anos'],'.trinta')
          //   fillDiv('div.s08',mData['acima_de_60'],'.sessenta')
          // })
          fillDiv('div.s04',co2,'.bignumber')
          fillDiv('div#s05_01',estacoes,'.bignumber')
          fillDiv('div#s05_02',veiculos,'.bignumber')
          fillDiv('div#s06_01',viagens,'.bignumber')
          fillDiv('div#s06_03',dist,'.smallnumber')
          fillDiv('div#s07_01',usuarios,'.bignumber')
          fillDiv('div#s07_02',hom,'.demodata')
          fillDiv('div#s07_03',mul,'.demodata')
          fillDiv('div.s08',jovens,'.quinze')
          fillDiv('div.s08',adultos,'.trinta')
          fillDiv('div.s08',idosos,'.sessenta')
        })

      }
      //insert all main fields
      perc_veiculos(mData)
      fillDiv('div.s04',mData['emissões_de_co2_evitadas'],'.bignumber')
      fillDiv('div#s05_01',mData['estações'],'.bignumber')
      fillDiv('div#s05_02',mData['veiculos'],'.bignumber')
      fillDiv('div#s06_01',mData['viagens_diárias'],'.bignumber')
      fillDiv('div#s06_03',mData['média_distância_percorrida_por_dia'],'.smallnumber')
      fillDiv('div#s07_01',mData['usuários'],'.bignumber')
      fillDiv('div#s07_02',mData['homens'],'.demodata')
      fillDiv('div#s07_03',mData['mulheres'],'.demodata')
      fillDiv('div.s08',mData['15_até_29_anos'],'.quinze')
      fillDiv('div.s08',mData['30_até_59_anos'],'.trinta')
      fillDiv('div.s08',mData['acima_de_60'],'.sessenta')

    })
    markers.on('mouseover',function(e){

      let mData = e.layer.options;
      let cidade = mData.cidade;

      let currentLat = mData.lat;
      let currentLong = mData.long;

      let replacePx = str => str.replace('px','');

      let map_left = d3.select('div#map').style('left');
      let map_top = d3.select('div#map').style('top');

      let coordPoints = map.latLngToContainerPoint([currentLat, currentLong]);

      let cityName = d3
      .select('body')
      .append('div')
      .attr('class', 'nametip')
      .html(cidade)
      ;

      var mapdiv = document.getElementById("map");
      let divOffset = offset(mapdiv);

      let stringX = cityName.style('width');
      let clearX = stringX.replace('px','')
      let finalX = (coordPoints.x + divOffset.left) - Number(clearX)/2
      let finalY = (coordPoints.y + divOffset.top)


      cityName
      .style('left', finalX + 'px')
      .style('top', finalY + 'px')
      ;

    })
    markers.on('mouseout',function(e){

      let mData = e.layer.options
      let cidade = mData.cidade;

      d3
      .select('div.nametip')
      .remove()

    })
		map.addLayer(markers);


    }
  )
  ;
