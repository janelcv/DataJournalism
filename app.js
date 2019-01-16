// @TODO: YOUR CODE HERE!



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

// Initial Params
var chosenXAxis = "smokes";
// var chosenYAxis =  "age";

// function used for updating x-scale var upon click on axis label
function xScale(riskData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(riskData, d => d[chosenXAxis]) * 0.8,
      d3.max(riskData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
// function yScale(riskData, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(riskData, d => d[chosenYAxis]) * 0.8,
//       d3.max(riskData, d => d[chosenYAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return yLinearScale;

// }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// // function used for updating yAxis var upon click on axis label
// function renderAxes(newYScale, yAxis) {
//   var leftAxis = d3.axisBottom(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(leftAxis);

//   return yAxis;
// }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "smokes") {
    var label = "Smokes:";
  }
  else {
    var label = "poverty:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state} (${d.abbr})<br>${label} ${d[chosenXAxis]}`);
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
    // var xLinearScale = d3.scaleLinear()
      // .domain([5, d3.max(riskData, d => d.smokes)])
      // .range([0, width]);
     // xLinearScale function 
    var xLinearScale = xScale(riskData, chosenXAxis); 
  

    var yLinearScale = d3.scaleLinear()
      .domain([30, d3.max(riskData, d => d.age)])
      .range([height, 0]);

    // Step 3: Create axis functions
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

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    var circRadius = 15; 
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", circRadius)
    .style("stroke", "black")
    .style("stroke-width", 4)
    .style("fill", "turquoise")
    .attr("opacity", ".7")
     
    // circlesGroup.append("text")
    // .attr("dx", d => xLinearScale(d[chosenXAxis]))
    // .text(d => d.abbr)
    // .attr("dy", d => yLinearScale(d[age]) + circRadius/2.5)
    // .attr("font-size", circRadius)
    // .attr("class", "stateText");


    
    // Create group for  3 x- axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width * .75}, 0)`);

    var smokesLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "smokes") // value to grab for event listener
      .classed("active", true)
      .text("Proportion of smoking people(%)");

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", true)
      .text("Proportion of people in poverty (%)");

    var obesityLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Proportion of people with obesity(%)");

    // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Average age");



    // Step 6: Initialize tool tip
    // ==============================
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(riskData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "smokes") {
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
        else if (chosenXAxis === "poverty"){
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

      // var toolTip = d3.tip()
      //   .attr("class", "tooltip")
      //   .offset([80, -60])
      //   .html(function(d) {
      //     return (`<strong>${d.state}</strong><br>Age: ${d.age}<br> Smokes: ${d.smokes}`);
      //   });

      // Step 7: Create tooltip in the chart
      // ==============================
      // chartGroup.call(toolTip);

      // // Step 8: Create event listeners to display and hide the tooltip
      // // ==============================
      // circlesGroup.on("click", function(data) {
      //   toolTip.show(data, this);
      // })
      //   // onmouseout event
      //   .on("mouseout", function(data, index) {
      //     toolTip.hide(data);
      //   });
  

    // Create axes labels
    // chartGroup.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left + 40)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1em")
    //   .attr("class", "axisText")
    //   .text("Age");

  //   chartGroup.append("text")
  //     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  //     .attr("class", "axisText")
  //     .text("Smokes");
  // });





