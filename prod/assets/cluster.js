// import {div,loadData,populateFields} from './main.js'

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



const myRequest = new Request('assets/final_file_labmob_v2.json');

fetch(myRequest)
  .then(response => response.json())
  .then(data => {

    console.log(data.municipios)
    // var layer = new L.StamenTileLayer("toner");

    const tonerUrl = "http://{S}tile.stamen.com/toner-lite/{Z}/{X}/{Y}.png";

    const url = tonerUrl.replace(/({[A-Z]})/g, s => s.toLowerCase());

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

    let latlng = L.latLng(-16, -55);;
    // var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		// 		maxZoom: 7,
		// 		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
		// 	}),
		// 	latlng = L.latLng(-10, -55);

		var map = L.map('map', {center: latlng, zoom: 4.4, maxZoom: 8, minZoom: 4
      // , layers: [tiles]
    });

    var purpleIcon = L.icon({
    iconUrl: 'assets/icon_v2.png',
    shadowUrl: 'assets/shadow_v2.png',

    iconSize:     [16, 22], // size of the icon
    shadowSize:   [16, 12], // size of the shadow
    iconAnchor:   [16, 22], // point of the icon which will correspond to marker's location
    shadowAnchor: [8, 10],  // the same for the shadow
    popupAnchor:  [-8, -5] // point from which the popup should open relative to the iconAnchor
    });

		var markers = L.markerClusterGroup({ chunkedLoading: true });

    const brasil = new Request('assets/brazil_new.json')

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

    markers.on('click',function(e){

      d3.select('div#s01').html(e.layer.options.cidade)

      let mData = e.layer.options
      let s = mData.sistemas;

      d3.select('div.s02').select('.bignumber').html(s.length)

      let lista_veiculo = [mData.bicicletas,mData.bicicletas_elétricas,mData.patinetes_elétricos]

      d3.selectAll('.buttonfilter').remove()
      d3.selectAll('.bike').remove()
      d3.selectAll('.bike_el').remove()
      d3.selectAll('.pat_el').remove()
      //insert todos
      d3.select('div.s03').insert('div').attr('class', 'buttonfilter').html('Todos').on('click',function(){
        console.log(mData);
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
        // d3.selectAll('.buttonfilter').remove()
        d3.select('div.s03').insert('div').attr('class', 'buttonfilter').html(sist.sistema).on('click',function(){
          // d3.select('.buttonfilter').remove()
          perc_veiculos(sist)
          // d3.select('div.s03').insert('div').attr('class', 'buttonfilter').html('Todos').on('click',function(mData){
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
		map.addLayer(markers);


    }
  )
  ;

















		// var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		// 		maxZoom: 18,
		// 		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
		// 	}),
		// 	latlng = L.latLng(-37.89, 175.46);
    //
		// var map = L.map('map', {center: latlng, zoom: 13, layers: [tiles]});
    //
		// var markers = L.markerClusterGroup({ chunkedLoading: true });
    //
		// for (var i = 0; i < addressPoints.length; i++) {
		// 	var a = addressPoints[i];
		// 	var title = a[2];
		// 	var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
		// 	marker.bindPopup(title);
		// 	markers.addLayer(marker);
		// }
    //
		// map.addLayer(markers);
