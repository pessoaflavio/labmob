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

const myRequest = new Request('data/final_file_labmob_v8.json');

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    console.log(data.municipios)
		var map = L.map('map', {center: latlng, zoom: 4.4, maxZoom: 10, minZoom: 4, zoomDelta: 2
      // , layers: [tiles]
    });


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


    // map(data.municipios)
    const estados_listados = data.municipios.map(cidade => cidade.estado)
    const estados_unicos = [...new Set(estados_listados)]
    console.log(estados_unicos);
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
    let grupo_cidades = []

    for (var j = 0; j < estados_unicos.length; j++){

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
          '15_até_29_anos': a['15_até_29_anos'],
          '30_até_59_anos': a['30_até_59_anos'],
          'acima_de_60': a['acima_de_60'],
          modais: a.modais
          });
        // console.log(marker2.options.icon.options.html)
  			// marker2.bindPopup(title);
  			// markers.addLayer(marker);
        grupo_cidades.push(marker2);

  		}

      console.log(grupo_cidades)

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




    }

    var estados = L.layerGroup(grupo_cidades);
    markers.addLayer(estados);
    map.addLayer(markers);
    



    }
  )
  ;
