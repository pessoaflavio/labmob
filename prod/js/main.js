
////////// Controle de dados

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


let scaleLin = d3.scaleLinear()
    .domain([0, 8000])
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
function fillSidePanel(data){

  let mainHolder = d3
  .select('.side')
  ;

  fillDiv('div.s02',data['emissões_de_co2_evitadas'],'.bignumber')

  // fillDiv('div.s04',total_veiculos(data),'.bignumber')

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

  mainHolder
  .select('#s01')
  // .append('h3')
  .html('<h3>' + data.local + '</h3>')
  ;

  mainHolder
  .select('.s03')
  .insert('div')
  .attr('class', 'button')
  .html('<a href="sistemas.html">Lista de sistemas</a>')
  ;

}

let div = d3.select('body').append('div').attr('class','tooltip').style('opacity', 0);

d3.select('div.side').style('background-color', '#EDEDED');

function loadData(data){
  d3.json(data).then(data => fillSidePanel(data));
};

loadData('data/final_file_labmob_v6.json')
