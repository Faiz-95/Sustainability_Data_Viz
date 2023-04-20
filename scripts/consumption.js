
// set the dimensions and margins of the graph
const margin = {top: 80, right: 135, bottom: 80, left: 150},
    width = 1050 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#myChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/Faiz-95/Sustainability_Data_Viz/main/data/energyConsumption.csv").then( function(data) {

  //GENERAL//
  
  const energyTypes = data.columns.slice(1)

  // color palette
  const color = d3.scaleOrdinal()
    .domain(energyTypes)
    .range(["#7264E8","#CA3C7E","#ED6A2C","#F4B13E"]);

  //stack the data
  const stackedData = d3.stack()
    .keys(energyTypes)
    (data)


  svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "26px") 
            .style('font-family', 'Helvetica')
            .style("font-weight", "bold")
            .text("Total Energy Consumption in Australia (1980-2019)");


  // Add X axis
  const x = d3.scaleLinear()
    .domain([1980, 2019])
    .range([ 0, width ]);
  const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .style('font-family', 'Helvetica')
    .style("font-size", 15)
    .call(d3.axisBottom(x).ticks(5)
    .tickFormat(d3.format('d')));

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", height+60 )
      .style('font-family', 'Helvetica')
      .style("font-size", 20)
      .text("Year");

  // Add Y axis label:
  svg.append("text")
      .attr('x', -240)
      .attr("y", -80 )
      .attr('transform', 'rotate(270)')
      .text("Amount of Energy Consumed (Petajoules)")
      .style('font-family', 'Helvetica')
      .style("font-size", 20)
      .attr('text-anchor', 'middle')

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 7000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(7))
    .style('font-family', 'Helvetica')
    .style("font-size", 15)


  
  // BRUSHING AND CHART //

  const clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  const brush = d3.brushX()                
      .extent( [ [0,0], [width,height] ] ) 
      .on("end", updateChart) 


  const areaChart = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Area generator
  const area = d3.area()
    .x(function(d) { return x(d.data.Date); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)


  // Add the brushing
  areaChart
    .append("g")
      .attr("class", "brush")
      .call(brush);

  let idleTimeout
  function idled() { idleTimeout = null; }


  function updateChart(event,d) {

    extent = event.selection


    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); 
      x.domain(d3.extent(data, function(d) { return d.Date; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) 
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('d')))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }

    // HIGHLIGHT GROUP //

    // What to do when one group is hovered
    const highlight = function(event,d){
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // except the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event,d){
      d3.selectAll(".myArea").style("opacity", 1)
    }


    // create a tooltip
      var Tooltip3 = d3.select("#div_template")
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

      var mouseover3 = function(d) {
        Tooltip3
          .style("opacity", 1)
      }

      var mousemove3 = function(d) {
        Tooltip3
          .html("State : ")
          .style("left", (d3.mouse(this)[0]+350) + "px")
          .style("top", (d3.mouse(this)[1]+120) + "px")
      }

      var mouseleave3 = function(d) {
        Tooltip3
          .style("opacity", 0)
      }

    // LEGEND //

    // Add one dot in the legend for each name.
    const size = 30
    svg.selectAll("myrect")
      .data(energyTypes)
      .join("rect")
        .attr("x", 800)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) 
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)


    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(energyTypes)
      .join("text")
        .attr("x", 810 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) 
        .text(function(d){ return d})
        .style('font-family', 'Helvetica')
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
})
