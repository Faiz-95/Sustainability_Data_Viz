
// set the dimensions and margins of the graph

  var margin2 = {top: 80, right: 20, bottom: 60, left: 340},
      width2 = 1050 - margin2.left - margin2.right,
      height2 = 600 - margin2.top - margin2.bottom;

  // append the svg object to the body of the page
  var svg2 = d3.select("#div_template_2")
      .append("svg")
      .attr("width", width2 + margin2.left + margin2.right)
      .attr("height", height2 + margin2.top + margin2.bottom)
      .append("g")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  //Read the data
  d3.csv("https://raw.githubusercontent.com/Faiz-95/Sustainability_Data_Viz/main/data/energyProduction2.csv", function(data) {
      
      // Labels of row and columns -> unique identifier of the column called 'year' and 'state'
      var myYears2 = d3.map(data, function(d){return d.year2;}).keys()
      var myStates2 = d3.map(data, function(d){return d.state2;}).keys()
      
      svg2.append("text")
            .attr("x", (width2 / 2))             
            .attr("y", 0 - (margin2.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "26px") 
            .style('font-family', 'Helvetica')
            .style("font-weight", "bold")
            .text("Non-Renewable Energy Production in Australia (2010-19)");

      // Build X scales and axis:
      var x2 = d3.scaleBand()
        .range([ 0, width2 ])
        .domain(myYears2)
        .padding(0.075);
      svg2.append("g")
        .style("font-size", 15)
        .style('font-family', 'Helvetica')
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x2).tickSize(0))
        .select(".domain").remove()


      // Add X axis label:
      svg2.append("text")
          .attr("text-anchor", "middle")
          .attr("x", width2/2)
          .attr("y", height2+60 )
          .style('font-family', 'Helvetica')
          .style("font-size", 20)
          .text("Year");


      // Build Y scales and axis:
      var y2 = d3.scaleBand()
        .range([ height2, 0 ])
        .domain(myStates2)
        .padding(0.075);
      svg2.append("g")
        .style("font-size", 15)
        .style('font-family', 'Helvetica')

        .call(d3.axisLeft(y2).tickSize(0))
        .select(".domain").remove()

      // Add Y axis label:
      svg2.append("text")
          .attr('x', -240)
          .attr('y', -70)
          .attr('transform', 'rotate(270)')
          .text("Different States")
          .style('font-family', 'Helvetica')
          .attr('text-anchor', 'middle')
          .style("font-size", 20)

      // Build color scale
      var myColor2 = d3.scaleLinear()
        .range(["#fdf5b8", "#f0d295", "#e2ae77", "#d38b61", "#c16752", "#ab4448", "#911d43"])
        .domain([0, 10000, 20000, 30000, 40000, 50000, 60000, 70000])



      // create a tooltip
      var Tooltip2 = d3.select("#div_template_2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "rgb(223,224,220)")
        .style("border", "solid")
        .style("border-width", "2.5px")
        .style("border-radius", "5px")
        .style("padding", "7px")
        .style("position", "absolute")
        .style("text-align", "left")


      var mouseover2 = function(d) {
        Tooltip2
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "#63132D")
          .style("opacity", 1)
      }
      var mousemove2 = function(d) {
        Tooltip2
          .html("State : " + d.fullstate2 + "<br>Year : " + d.year2 + "<br>Amount : " + d.amount2 + " GWh")
          .style("left", (d3.mouse(this)[0]+350) + "px")
          .style("top", (d3.mouse(this)[1]+100) + "px")
        d3.select(this)
          .style("stroke", "#63132D")
          .style("opacity", 1)
      }
      var mouseleave2 = function(d) {
        Tooltip2
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      }


      // add the squares
      svg2.selectAll()
        .data(data, function(d) {return d.year2 +':'+d.state2;})
        .enter()
        .append("rect")
          .attr("x", function(d) { return x2(d.year2) })
          .attr("y", function(d) { return y2(d.state2) })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", x2.bandwidth() )
          .attr("height", y2.bandwidth() )
          .style("fill", function(d) { return myColor2(d.amount2)} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 1)
        .on("mouseover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2)
    })
  