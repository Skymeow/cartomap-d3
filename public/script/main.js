$(document).ready(()=>{
  console.log('main.js is linked');
  // const housing = $('.housing');
  // const score2 = $('.score2');
      const button = $('.button');
      const switch1 = $('.switch');
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
     const generateChart=(e)=>{
      // x-ais
      d3.json('https://api.teleport.org/api/urban_areas/slug:denver/scores/',function(data){
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
    }
// end first analysis
  const switchChart=(e)=>{
      // x-ais
      d3.json('https://api.teleport.org/api/urban_areas/slug:seattle/scores/',function(data){
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
      });;
        bars.exit().remove();
      })
    }


   button.on('click',generateChart);
   switch1.on('click',switchChart);

// end of barchart analysis

})
