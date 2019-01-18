// Setting up the graph 
// ==============================

var svgWidth = 750;
var svgHeight = 500;

var margins = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margins.left - margins.right;
var height = svgHeight - margins.top - margins.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var scatterGroup = svg.append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`);

// ==============================

// Creating functions 
// ==============================
// Initial params
var chosenXAxis = "age";
var chosenYAxis = "smokes";

// function used for updating x-y-scale var upon click on axis label
function xScale(riskData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, d => d[chosenXAxis]) * 0.8,
      d3.max(riskData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(riskData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, d => d[chosenYAxis]) * 0.8,
      d3.max(riskData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;  
}

// function used for updating yAxis and xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;  
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, circleTexts, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  console.log(circlesGroup);

  circlesGroup.selectAll('circle').transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
    
  
  circleTexts.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var xlabel = "Average Age:";
  }
  else if (chosenXAxis === "income") {
    var xlabel = "Income (USD):"
  }

  if (chosenYAxis === "smokes") {
    var ylabel = "Have Obesity %:";
  }
  else if (chosenYAxis ==="obesity" ) {
    var ylabel = "Smokers %:";
  }
  else if (chosenYAxis === "poverty"){
    var ylabel = "In poverty %:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(riskData) {
    toolTip.show(riskData, this);
  })
    // onmouseout event
    .on("mouseout", function(riskData) {
      toolTip.hide(riskData);
    });

  return circlesGroup;
}
// ==============================

// Import Data
// ==============================
d3.csv("riskData.csv").then(function(riskData) {
  console.log(riskData)

  // Convert numeric riskData from string to float
  riskData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // ==============================


  // Step: Create scale functions
  // ==============================
  var xLinearScale = xScale(riskData, chosenXAxis);
  var yLinearScale = yScale(riskData, chosenYAxis);
  
  // ==============================

  // Step: Create axis functions
  // ==============================

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // ==============================

  // Step: Append Axes to the chart
  // ==============================
  var xAxis = scatterGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = scatterGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // ==============================

  // Step: Create Circles
  // ==============================
  var circlesGroup = scatterGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("g")
    .classed("element-group", true)

  
  var circRadius = 15; 

  circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", circRadius)
    .style("stroke", "black")
    .style("stroke-width", 4)
    .style("fill", "turquoise")
    .attr("opacity", ".7")


  var circleTexts = circlesGroup.append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis])) 
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .style("text-anchor", "middle")
    .attr("dy", ".3em")
    .text(d => d.abbr)
    .attr("font-size", 10)
    .attr("class", "stateText")
    .style("fill", "black");

  // ==============================

    
  // Create group for  x- axis labels
  // ============================== 
  var labelsXGroup = scatterGroup.append("g")
        .attr("transform", `translate(${width / 3}, ${height + margins.top})`);

    
var ageLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("valueX", "age") // value for event listener
    .classed("inactive", true)
    .text("Median Age (years)");    

var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("valueX", "income") // value for event listener
    .classed("inactive", true)
    .text("Median Household Income (USD)");    
  // ==============================

  // Create group for y-axis labels
  // ==============================
  var labelsYGroup = scatterGroup.append("g")
    .attr("transform", "rotate(-90)");


  var obesityLabel = labelsYGroup.append("text")
    .attr("y", 0 - margins.left + 60)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("valueY", "obesity") // value for event listener
    .classed("active", true)
    .text("Have Obesity %");

  var smokesLabel = labelsYGroup.append("text")
    .attr("y", 0 - margins.left + 40)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("valueY", "smokes") // value for event listener
    .classed("inactive", true)
    .text("Smokers %");

  var povertyLabel = labelsYGroup.append("text")
    .attr("y", 0 - margins.left + 20)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("valueY", "poverty") // value for event listener
    .classed("inactive", true)
    .text("In Poverty %"); 
  // ============================== 


  // Step : Initialize tool tip
  // ============================== 
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // Create x-axis label event listener
  labelsXGroup.selectAll("text")
    .on("click", function() {

      // get value of selection
      var valueX = d3.select(this).attr("valueX");
      if (valueX !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = valueX;
        console.log(chosenXAxis);

        // updates x scale for new data
        xLinearScale = xScale(riskData, chosenXAxis);

        // Update x-axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new values
        circlesGroup = renderCircles(circlesGroup,circleTexts, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
              .classed("active", true)
              .classed("inactive", false);
          incomeLabel
              .classed("active", false)
              .classed("inactive", true);
        }
        
        else if (chosenXAxis === "income"){
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
        }
    }
    })
    

  // Create y-axis label event listener
  labelsYGroup.selectAll("text")
    .on("click", function() {

      // get value of selection
      var valueY = d3.select(this).attr("valueY");
      if (valueY !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = valueY;
        console.log(chosenYAxis);

        // updates y scale for new data
        yLinearScale = yScale(riskData, chosenYAxis);

        // Update the y-axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new values
        circlesGroup = renderCircles(circlesGroup,circleTexts, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates circles with new y values
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenYAxis === "poverty") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
    // ==============================
    });
});