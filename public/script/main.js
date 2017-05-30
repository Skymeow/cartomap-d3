$(document).ready(()=>{
  console.log('main.js is linked');
      const scores = $('#scores');
      const salaries = $('#salaries');
      var outerWidth = 1000;
      var outerHeight = 550;
      var margin = { left: 90, top: 50, right: 30, bottom: 200 };
      var barPadding = 0.2;
      var innerWidth  = outerWidth  - margin.left - margin.right;
      var innerHeight = outerHeight - margin.top  - margin.bottom;

      var svg = d3.select("body").append("svg")
        .attr("width",  outerWidth)
        .attr("height", outerHeight);
      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var xAxisG = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerHeight + ")")

      var yAxisG = g.append("g")
        .attr("class", "y axis");

     var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
      var yScale = d3.scale.linear().range([innerHeight, 0]);

      var xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0);          // Turn off the marks at the end of the axis.
      var yAxis = d3.svg.axis().scale(yScale).orient("left")
        .ticks(10)
        .outerTickSize(0); // Turn off the marks at the end of the axis.
      var color = d3.scale.threshold()
    .domain([3,4,5,6,7,8,9])
    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f","#3c1c67","#48227b"]);
// first set of analysis
      scores.click(function(){
        var value = $('.selector option:selected').val();
      // x-ais
      d3.json(`https://api.teleport.org/api/urban_areas/slug:${value}/scores/`,function(data){
      var dataset = data.categories;
      var newArr = dataset.map(function(data){
        return data.score_out_of_10
      })
      var newArrName = dataset.map(function(data){
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

        var bars = g.selectAll("rect").data(newArr);
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

    salaries.click(function(){
      var value = $('.selector option:selected').val();
      // x-ais
      d3.json(`https://api.teleport.org/api/urban_areas/slug:${value}/salaries/`,function(data){
      var dataset = data.salaries;
      console.log(data.salaries);
      var categories = dataset.map(function(data){
        return data.job.title
      })

      var dollars = dataset.map(function(data){
        return [data.salary_percentiles.percentile_25,data.salary_percentiles.percentile_75]
      })

      var minArr = dataset.map(function(data){
        return data.salary_percentiles.percentile_25
      })

       var maxArr = dataset.map(function(data){
        return data.salary_percentiles.percentile_75
      })

       var mediArr = dataset.map(function(data){
        return data.salary_percentiles.percentile_50
      })
      console.log(mediArr)
      console.log(d3.max(mediArr,function(d){return d}))
       var totalArr = minArr.concat(maxArr);

      var grid = d3.range(30).map(function(i) {
      return {
        'x1': 0,
        'y1': 0,
        'x2': 0,
        'y2': 1200
      };
    });
      var color = d3.scale.linear().domain([0, categories.length]).range(['red','beige']);
      var xscale = d3.scale.linear()
      .domain([
        d3.min(totalArr,function(t){
        return t
      }),
        d3.max(totalArr,function(d){
             return d
           })])
       .range([0, 800]);

    var yscale = d3.scale.linear()
      .domain([0, categories.length])
      .range([0, 1200]);

    var canvas = d3.select('#wrapper')
      .append('svg')
      .attr({
        'width': 1000,
        'height': 1300
      });

    var grids = canvas.append('g')
      .attr('id', 'grid')
      .attr('transform', 'translate(150,20)')
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

    var xAxis = d3.svg.axis();
    xAxis
      .orient('bottom')
      .scale(xscale)

    var yAxis = d3.svg.axis();
    yAxis
      .orient('left')
      .scale(yscale)
      .tickSize(2)
      .tickFormat(function(d, i) {
        return categories[i];
      })
      .tickValues(d3.range(53));

    var y_xis = canvas.append('g')
      .attr("transform", "translate(150,29)")
      .attr('id', 'yaxis')
      .call(yAxis);

    var x_xis = canvas.append('g')
      .attr("transform", "translate(150,1219)")
      .attr('id', 'xaxis')
      .call(xAxis);

    var chart = canvas.append('g')
      .attr("transform", "translate(150,0)")
      .attr('id', 'bars')
      .selectAll('rect')
      .data(dollars)
      .enter()
      .append('rect')
      .attr('height', 19)
      .attr({
        'x': function(d) {
          return xscale(d[0]);
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

    var transit = d3.select("svg").selectAll("rect")
      .data(dollars)
      .transition()
      .duration(1000)
      .attr("width", function(d) {
        return xscale(d[1]) - xscale(d[0]);
      })

    })
    })
// end of barchart analysis

})
