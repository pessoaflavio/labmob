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

const myRequest = new Request('data/operadoras.json');


fetch(myRequest)
  .then(response => response.json())
  .then(data => {

    console.log(data)


		var map = L.map('map', {center: latlng, zoom: 4.4, maxZoom: 9, minZoom: 4
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

		var markers = L.markerClusterGroup({
      chunkedLoading: true,
      disableClusteringAtZoom:5,
      spiderfyOnMaxZoom:false,
      polygonOptions: {
        stroke: false,
        fill: false
        }
      }
    );

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

		for (var i = 0; i < data.length; i++) {
			var a = data[i];
      var operadora = a.operadora
      for (var j=0; j < a.cidades.length; j++){
        var b = a.cidades[j]
        var title = b.cidade
              var marker2 = L.marker(L.latLng(b.lat, b.long), {
                lat: b.lat,
                long: b.long,
                icon: L.divIcon({
                  className: 'nametip',
                  html: `<img src="img/icon_ball.png" width="14px" height="14px" ><br>${b.cidade}`,
                  iconAnchor: [8, 14],
                  popupAnchor: [-8, -5]
                }),
                cidade: b.cidade
                });
        			marker2.bindPopup(title);
        			// markers.addLayer(marker);
              markers.addLayer(marker2);

      }


		}

    // markers.on('mousedown',function(e){
    //
    //   let mData = e.layer.options
    //   let s = mData.sistemas;
    //   let lista_veiculo = [mData.bicicletas,mData.bicicletas_elétricas,mData.patinetes_elétricos]
    //
    // })

    // // adicionar nome da cidade por cima do marker com mouse
    // markers.on('mouseover',function(e){
    //
    //   let mData = e.layer.options;
    //   let cidade = mData.cidade;
    //
    //   let currentLat = mData.lat;
    //   let currentLong = mData.long;
    //
    //   let replacePx = str => str.replace('px','');
    //
    //   let map_left = d3.select('div#map').style('left');
    //   let map_top = d3.select('div#map').style('top');
    //
    //   let coordPoints = map.latLngToContainerPoint([currentLat, currentLong]);
    //
    //   let cityName = d3
    //   .select('body')
    //   .append('div')
    //   .attr('class', 'nametip')
    //   .html(cidade)
    //   ;
    //
    //   var mapdiv = document.getElementById("map");
    //   let divOffset = offset(mapdiv);
    //
    //   let stringX = cityName.style('width');
    //   let clearX = stringX.replace('px','')
    //   let finalX = (coordPoints.x + divOffset.left) - Number(clearX)/2
    //   let finalY = (coordPoints.y + 100)
    //
    //
    //   cityName
    //   .style('left', finalX + 'px')
    //   .style('top', finalY + 'px')
    //   ;
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
		map.addLayer(markers);

    }
  )
  ;
