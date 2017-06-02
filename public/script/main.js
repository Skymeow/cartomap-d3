$(document).ready(()=>{
  $('iframe').hide();
  console.log('main.js is linked');
    const currentTime = $('#time');
    const timeText = $('.time-content');
    const go = $('#go');
    const pic = $('#pic');
    const picContainer = $('.picContainer');
    picContainer.attr('style', 'visibility: hidden');

    go.click(function(){
     var city = $('.selector option:selected').val();
     if(city === "new-york"){
        $('iframe').show();
      }else{
        $('iframe').hide();
      }
     // start of get current time by city
     fetch(`https://timezoneapi.io/api/address/?${city}`)
    .then(r=>r.json())
    .then(data=>{
      data = data.data.addresses[0].datetime.date_time_txt
      timeText.html(data)
    })
    // start of get pics of city
      picContainer.attr('style', 'visibility: visible')
       fetch(`https://api.teleport.org/api/urban_areas/slug:${city}/images/`)
      .then(r=>r.json())
      .then(url=>{
        url = url.photos[0].image.web
        picContainer.attr('src', url)
      })
    })
      // start of d3 visualization
      const scores = $('#scores');
      const summary = $('.summary');
      const salaries = $('#salaries');
      const outerWidth = 1000;
      const outerHeight = 550;
      const margin = { left: 90, top: 50, right: 30, bottom: 200 };
      const barPadding = 0.2;
      const innerWidth  = outerWidth  - margin.left - margin.right;
      const innerHeight = outerHeight - margin.top  - margin.bottom;
      const svg = d3.select("#d3-elements").append("div")
       .classed("svg-container", true)
       .append("svg")
       .attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", "0 0 1000 550")
       .classed("svg-content-responsive", true);

      const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const xAxisG = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerHeight + ")")

      const yAxisG = g.append("g")
        .attr("class", "y axis");

      const xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
      const yScale = d3.scale.linear().range([innerHeight, 0]);

      const xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0);          // Turn off the marks at the end of the axis.
      const yAxis = d3.svg.axis().scale(yScale).orient("left")
        .ticks(10)
        .outerTickSize(0); // Turn off the marks at the end of the axis.

      const color = d3.scale.threshold()
        .domain([3,4,5,6,7,8,9])
        .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f","#3c1c67","#48227b"]);
      // first set of analysis
      scores.click(function(){
        $(window).scrollTo($('#d3-elements'),1000);
        const value = $('.selector option:selected').val();
      // x-ais
      d3.json(`https://api.teleport.org/api/urban_areas/slug:${value}/scores/`,function(data){
      const dataset = data.categories;
      console.log(data.categories);
      const text = data.summary;
      const totalScore = data.teleport_city_score;
      const sumScore = $('.sum-score');
      sumScore.html(totalScore);
      console.log(text);
      summary.html(text);
      $(".summary p:nth-of-type(2)").hide();
      const newArr = dataset.map(function(data){
        return data.score_out_of_10
      })

      const newArrName = dataset.map(function(data){
        return data.name
      })
        xScale.domain(newArrName)
        yScale.domain([0, d3.max(newArr,function(d){
           return d
         })]);
        xAxisG.call(xAxis).selectAll("text").style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");;
        yAxisG.call(yAxis);
        const bars = g.selectAll("rect").data(newArr);
        bars.enter().append("rect")
          .attr("width", xScale.rangeBand());
        bars
           .attr("x",function(d,i){
            return xScale(newArrName[i]);
          })
          .attr("y", function(d,i){
            return yScale(newArr[i]);
          })
          .attr("height", function (d,i){ return innerHeight - yScale(newArr[i])})
          .attr("fill", function(d) {
            return color(d);
          });
           bars.exit().remove();
        })
    })
        // end first analysis
        const grid = d3.range(28).map(function(i) {
          return {
            'x1': 0,
            'y1': 29,
            'x2': 0,
            'y2': 1200
          };
        });

        const canvas = d3.select('#wrapper').append("div")
             .classed("canvas-container", true)
             .append("svg")
             .attr("preserveAspectRatio", "xMinYMin meet")
             .attr("viewBox", "0 0 1000 1300")
             .classed("canvas-content-responsive", true);

        const yscale = d3.scale.linear()
           .range([19, 1200]);
        const y2Axis = d3.svg.axis().scale(yscale).orient('left');

        const x_xis = canvas.append('g')
          .attr("transform", "translate(230,1219)")
          .attr('id', 'xaxis');
        const xscale = d3.scale.linear()
                .range([0, 900]);
        const x2Axis = d3.svg.axis().scale(xscale).orient('bottom');

    salaries.click(function(){
      $(window).scrollTo($('#wrapper'),1000);
      const value = $('.selector option:selected').val();
      // x-ais
      d3.json(`https://api.teleport.org/api/urban_areas/slug:${value}/salaries/`,function(data){
      const dataset = data.salaries;

      const categories = dataset.map(function(data){
        return data.job.title
      })

      const dollars = dataset.map(function(data){
        return [data.salary_percentiles.percentile_25,data.salary_percentiles.percentile_75]
      })


      const minArr = dataset.map(function(data){
        return data.salary_percentiles.percentile_25
      })

       const maxArr = dataset.map(function(data){
        return data.salary_percentiles.percentile_75
      })

       const mediArr = dataset.map(function(data){
        return data.salary_percentiles.percentile_50
      })

      const totalArr = minArr.concat(maxArr);
      console.log(dollars)
      console.log(totalArr)
      const color = d3.scale.linear().domain([0, categories.length]).range(['red','beige']);

      xscale.domain([
        d3.min(totalArr,function(d){
        return d
      }),
        d3.max(totalArr,function(d){
             return d
           })]);

      x_xis.call(x2Axis);

      yscale.domain([0, categories.length]);

      const grids = canvas.append('g')
        .attr('id', 'grid')
        .attr('transform', 'translate(230,20)')
        .selectAll('line')
        .data(grid)
        .enter()
        .append('line')
        .attr({
          'x1': function(d, i) {
            return i * 28;
          },
          'y1': function(d) {
            return d.y1;
          },
          'x2': function(d, i) {
            return i * 28;
          },
          'y2': function(d) {
            return d.y2;
          },
        })
        .style({
          'stroke': '#adadad',
          'stroke-width': '1px'
        });

      y2Axis
        .tickSize(2)
        .tickFormat(function(d, i) {
          return categories[i];
        })
        .tickValues(d3.range(53));

      const y_xis = canvas.append('g')
        .attr("transform", "translate(230,29)")
        .attr('id', 'yaxis')
        .call(y2Axis);

      const chart = canvas.append('g')
        .attr("transform", "translate(230,0)")
        .attr('id', 'bars')
        .selectAll('rect')
        .data(dollars)
        .enter()
        .append('rect')
        .attr('height', 19)
        .attr({
          'x': function(d) {
            return xscale(d[0])+2;
          },
          'y': function(d, i) {
            return yscale(i) + 19;
          }
        })
        .style('fill', function(h, i) {
          return color(i);
        })
        .attr('width', function(d) {
          return 0;
        });

      const transit = d3.select("#wrapper").selectAll("rect")
        .data(dollars)
        .transition()
        .duration(1000)
        .attr("width", function(d) {
          return xscale(d[1]) - xscale(d[0]);
        });
      })
    })
     // end of barchart analysis
})
