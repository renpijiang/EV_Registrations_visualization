// the data line graph use to draw
//data = [
//    { year: 2016, value: 50009},
//    { year: 2017, value: 30009},
//    { year: 2018, value: 60009},
//]

function loadLineGraphData(stateName, vehicleType) {
  const data = [];
  for (let i = 0; i < yearScale.length; i++) {
    let obj = {};
    obj.year = yearScale[i];
    obj.value = vehicleData[stateName][yearScale[i]][vehicleType] / populationData[stateName][yearScale[i]] * 1000;//每一千人拥有车数量
    data[i] = obj;
  }
  return data;
};

function drawLineGraph(data, svgSelector, width, height) {
  //  SVG 
  const svg = d3.select(svgSelector);
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const margin = { top: 20, right: 30, bottom: 20, left: 30 };

  // Calculate the width and height of the area
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // clear previous content
  svg.selectAll("*").remove();

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // string into date
  data.forEach(d => {
    d.year = +d.year;
    d.value = +d.value;
  });

  // x axis range
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  //  y axis range
  var max = d3.max(data, d => d.value);
  const y = d3.scaleLinear()
    .domain([0, 200])
    .range([innerHeight, 0]);

  //  d3.line path
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value));

  // line path
  g.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", 2);

  g.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.value))
    .attr("r", 4)  // dot radius
    .style("fill", "black");

  const xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x)
      .ticks(data.length)   // keep the year and scale
      .tickFormat(d3.format("d")) // keep the scale is integer
    );

  //  X line
  xAxis.selectAll("path")
    .style("stroke-width", "1.5");

  //  X axis font
  xAxis.selectAll("text")
    .style("font-size", "14px")
    .style("font-family", "Arial")
    .style("font-weight", "bold")
    .style("fill", "black");

  // y axis
  const yAxis = g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y)
      .ticks(12)
      .tickFormat(d3.format("d"))
    );

  yAxis.selectAll("path")
    .style("stroke-width", "1.5");

  //  Y axis font
  yAxis.selectAll("text")
    .style("font-size", "14px")
    .style("font-family", "Arial")
    .style("font-weight", "bold")
    .style("fill", "black");
}