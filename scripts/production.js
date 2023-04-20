
// set the dimensions and margins of the graph

  var margin = {top: 80, right: 20, bottom: 60, left: 340},
      width = 1050 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#div_template")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("https://raw.githubusercontent.com/Faiz-95/Sustainability_Data_Viz/main/data/energyProduction1.csv", function(data) {
      
      // Labels of row and columns -> unique identifier of the column called 'year' and 'state'
      var myYears = d3.map(data, function(d){return d.year;}).keys()
      var myStates = d3.map(data, function(d){return d.state;}).keys()
      
      svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "26px") 
            .style('font-family', 'Helvetica')
            .style("font-weight", "bold")
            .text("Renewable Energy Production in Australia (2010-19)");

      // Build X scales and axis:
      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myYears)
        .padding(0.075);
      svg.append("g")
        .style("font-size", 15)
        .style('font-family', 'Helvetica')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()


      // Add X axis label:
      svg.append("text")
          .attr("text-anchor", "middle")
          .attr("x", width/2)
          .attr("y", height+60 )
          .style('font-family', 'Helvetica')
          .style("font-size", 20)
          .text("Year");


      // Build Y scales and axis:
      var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myStates)
        .padding(0.075);
      svg.append("g")
        .style("font-size", 15)
        .style('font-family', 'Helvetica')

        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

      // Add Y axis label:
      svg.append("text")
          .attr('x', -240)
          .attr('y', -70)
          .attr('transform', 'rotate(270)')
          .text("Different States")
          .style('font-family', 'Helvetica')
          .attr('text-anchor', 'middle')
          .style("font-size", 20)

      // Build color scale
      var myColor = d3.scaleLinear()
        .range(["rgb(251,248,216)", "rgb(208,232,185)", "rgb(142,202,187)", "rgb(95,176,193)", "rgb(63,134,182)", "rgb(45,83,157)", "rgb(20,40,106)"])
        .domain([0, 2000, 4000, 6000, 8000, 10000, 12000, 14000])



      // create a tooltip
      var Tooltip = d3.select("#div_template")
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


      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "rgb(9,13,62)")
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        Tooltip
          .html("State : " + d.fullstate + "<br>Year : " + d.year + "<br>Amount : " + d.amount + " GWh")
          .style("left", (d3.mouse(this)[0]+350) + "px")
          .style("top", (d3.mouse(this)[1]+100) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      }


      // add the squares
      svg.selectAll()
        .data(data, function(d) {return d.year+':'+d.state;})
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.year) })
          .attr("y", function(d) { return y(d.state) })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) { return myColor(d.amount)} )
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    })
  