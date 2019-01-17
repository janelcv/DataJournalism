// @TODO: YOUR CODE HERE!



var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "smokes";
// var chosenXAxis =  "age";

// function used for updating y-scale var upon click on axis label
function yScale(riskData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, d => d[chosenYAxis]) * 0.8,
      d3.max(riskData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}


// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, circleText, newYScale, chosenYAxis) {

  circlesGroup.select("circle").transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  circleText.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  

  return circlesGroup;
}

// // function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {

  if (chosenYAxis === "smokes") {
    var ylabel = "Smokers:";
    var xlabel = "Average Age:";
  }
  else if (chosenYAxis === "poverty"){
    var ylabel = "In poverty:";
    var xlabel = "Average Age:";
  }
  else 
  {
    var ylabel = "Have obesity:";
    var xlabel = "Average Age:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state} (${d.abbr})<br> ${ylabel} ${d[chosenYAxis]} % <br> ${xlabel} ${d.age} `);
    });

    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  return circlesGroup;
  
}

// Import Data

d3.csv("riskData.csv").then(function(riskData) {
  console.log(riskData)

    riskData.forEach(function(data) {
      data.age = +data.age;
      // console.log(data.age)
      data.smokes = +data.smokes;
      // console.log(data.smokes)
      data.poverty = +data.poverty;
      // console.log(data.poverty)
      data.obesity = +data.obesity;
      // console.log(data.obesity)

    });


    // Step 2: Create scale functions
    // ==============================
    var yLinearScale = yScale(riskData, chosenYAxis); 
  

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(riskData, d => d.age) * 0.8, d3.max(riskData, d => d.age)*1.2])
      .range([0, height]);

    // Step 3: Create axis functions
    //отвечает за графы xy
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // Step 5: Create Circles
    var circRadius = 15; 
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("g")
    .attr("class","element-group")

    circlesGroup.append("circle")
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("cx", d => xLinearScale(d.age))
      .attr("r", circRadius)
      .style("stroke", "black")
      .style("stroke-width", 4)
      .style("fill", "turquoise")
      .attr("opacity", ".7")
    
  
     
    var circleText = circlesGroup.append("text")
      .style("text-anchor", "middle")
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("x", d => xLinearScale(d.age))
      .attr("dy", ".3em")
      .text(d => d.abbr)
      .attr("font-size", 10)
      .attr("class", "stateText")
      .style("fill", "black");


    
    // Create group for  3 y- axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `rotate(-90)`);

    var smokesLabel = labelsGroup.append("text")
      .attr("x", 0 - (height/2))
      .attr("y", margin.right - 140)
      .attr("value", "smokes") // value to grab for event listener
      .attr("dy", "1em")
      .classed("active", true)
      .text("Proportion of smoking people(%)");

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0 - (height/2))
      .attr("y", margin.right - 120)
      .attr("value", "poverty") // value to grab for event listener
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Proportion of people in poverty (%)");

    var obesityLabel = labelsGroup.append("text")
    .attr("x", - (height/2))
    .attr("y", margin.right - 100)
    .attr("value", "obesity") // value to grab for event listener
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Proportion of people with obesity(%)");

    // append x axis
    chartGroup.append("text")
    .attr("transform", `translate(${width / 3}, ${height + 20})`)
    .attr("y", 20)
    .attr("x", 0)
    .attr("value", "age")
    .classed("axis-text", true)
    .text("Average age");



    //Step 6: Initialize tool tip
    // ==============================
    var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

      // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(riskData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, circleText, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "poverty"){
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else{
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);}
      }
    });
  });





