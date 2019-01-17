// @TODO: YOUR CODE HERE!
// Setting up the graph 
// ==============================

var svgWidth = 1000;
var svgHeight = 600;

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

// ==============================



// Creating functions 
// ==============================
// Initial Params
var chosenYAxis = "smokes";
var chosenXAxis =  "age";

// function used for updating x-y-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(riskData, chosenYAxis) {
  // create scales
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

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, circleText,  newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.select("circle").transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  circleText.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var xlabel = "Age (yrs):";
  }
  else if (chosenXAxis === "healthcare") {
    var xlabel = "Healthcare Insurance %:";
  }
  else if (chosenXAxis === "income") {
    var xlabel = "Income (USD):"
  }

  if (chosenYAxis === "smokes") {
    var ylabel = "Smokers %:";
  }
  else if (chosenYAxis === "poverty"){
    var ylabel = "In poverty %:";
  }
  else if(chosenYAxis === "obesity")
  {
    var ylabel = "Have obesity %:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state} (${d.abbr})<br> ${ylabel} ${d[chosenYAxis]} % <br> ${xlabel} ${d.age} `);
    });

    chartGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  return circlesGroup;
}
// ==============================

// Import Data
// ==============================
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
      data.income = +data.income;
      // console.log(data.income)
      data.healthcare = +data.healthcare;
      // console.log(data.healthcare)
    });

// ==============================

// Step: Create scale functions
// ==============================
var yLinearScale = yScale(riskData, chosenYAxis); 

var xLinearScale = xScale(riskData, chosenXAxis);

// var xLinearScale = d3.scaleLinear()
//   .domain([d3.min(riskData, d => d.age) * 0.8, d3.max(riskData, d => d.age) * 1.2])
//   .range([0, height]);
// ==============================

// Step: Create axis functions
// ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
// ==============================

// Step: Append Axes to the chart
// ==============================
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
// ==============================

// Step: Create Circles
// ==============================
var circRadius = 15; 
// ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("g")
    .attr("class","element-group")

    circlesGroup.append("circle")
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("r", circRadius)
      .style("stroke", "black")
      .style("stroke-width", 4)
      .style("fill", "turquoise")
      .attr("opacity", ".7")
    
  
     
    var circleText = circlesGroup.append("text")
      .style("text-anchor", "middle")
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", ".3em")
      .text(d => d.abbr)
      .attr("font-size", 10)
      .attr("class", "stateText")
      .style("fill", "black");

// ==============================

    
// Create group for  3 y- axis labels
// ==============================

var labelsYGroup = chartGroup.append("g")
.attr("transform", `rotate(-90)`);

var smokesLabel = labelsYGroup.append("text")
  .attr("x", 0 - (height/2))
  .attr("y", margin.right - 140)
  .attr("value", "smokes") // value to grab for event listener
  .attr("dy", "1em")
  .classed("active", true)
  .text("Proportion of smoking people(%)");

var povertyLabel = labelsYGroup.append("text")
  .attr("x", 0 - (height/2))
  .attr("y", margin.right - 120)
  .attr("value", "poverty") // value to grab for event listener
  .attr("dy", "1em")
  .classed("inactive", true)
  .text("Proportion of people in poverty (%)");

var obesityLabel = labelsYGroup.append("text")
.attr("x", - (height/2))
.attr("y", margin.right - 100)
.attr("value", "obesity") // value to grab for event listener
.attr("dy", "1em")
.classed("inactive", true)
.text("Proportion of people with obesity(%)");
// ==============================



// Create group for  3 x- axis labels
// ==============================

var labelsXGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height-10})`);

var ageLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "age") // value to grab for event listener
  .classed("active", true)
  .text("Average Age (years)");

var insuranceLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("inactive", true)
  .text("Proportion of people with health insurance (%)");

var incomeLabel = labelsXGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "income") // value to grab for event listener
.classed("inactive", true)
.text("Income (USD)");
// ==============================


// Step: Append Axes to the chart
// ==============================

// // append x axis
// chartGroup.append("text")
// .attr("transform", `translate(${width / 3}, ${height + 20})`)
// .attr("y", 20)
// .attr("x", 0)
// .attr("value", "age")
// .classed("axis-text", true)
// .text("Average age");
// ==============================


// Step : Initialize tool tip
// ==============================
circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// x axis labels event listener
labelsYGroup.selectAll("text")
.on("click", function() {
// get value of selection
var yValue = d3.select(this).attr("yValue");
if (yValue !== chosenYAxis) {

  // replaces chosenXAxis with value
  chosenYAxis = yValue;

  // console.log(chosenXAxis)

  // functions here found above csv import
  // updates x scale for new data
  yLinearScale = yScale(riskData, chosenYAxis);

  // updates y axis with transition
  yAxis = renderYAxes(yLinearScale, yAxis);

  // updates circles with new y values
  circlesGroup = renderCircles(circlesGroup, circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

  // updates tooltips with new info
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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
  else if(chosenYAxis === "obesity"){
  smokesLabel
    .classed("active", false)
    .classed("inactive", true);
  povertyLabel
    .classed("active", false)
    .classed("inactive", true);
  obesityLabel
    .classed("active", true)
    .classed("inactive", false);  
}
}
})
// ==============================


// x axis labels event listener
labelsXGroup.selectAll("text")
.on("click", function() {
// get value of selection
var xValue = d3.select(this).attr("xValue");
if (xValue !== chosenXAxis) {

  // replaces chosenXAxis with value
  chosenXAxis = xValue;

  // console.log(chosenXAxis)

  // functions here found above csv import
  // updates x scale for new data
  xLinearScale = xScale(riskData, chosenXAxis);

  // updates y axis with transition
  xAxis = renderXAxes(xLinearScale, xAxis);

  // updates circles with new y values
  circlesGroup = renderCircles(circlesGroup, circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

  // updates tooltips with new info
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // changes classes to change bold text
  if (chosenXAxis === "age") {
    ageLabel
      .classed("active", true)
      .classed("inactive", false);
    insuranceLabel
      .classed("active", false)
      .classed("inactive", true);
    incomeLabel
      .classed("active", false)
      .classed("inactive", true);
  }
  else if (chosenXAxis === "healthcare"){
    ageLabel
      .classed("active", false)
      .classed("inactive", true);
    insuranceLabel
      .classed("active", true)
      .classed("inactive", false);
    incomeLabel
      .classed("active", false)
      .classed("inactive", true);
  }
  else if(chosenXAxis === "income"){
  ageLabel
    .classed("active", false)
    .classed("inactive", true);
  insuranceLabel
    .classed("active", false)
    .classed("inactive", true);
  incomeLabel
    .classed("active", true)
    .classed("inactive", false);
  }  
}
// ==============================
});
});
