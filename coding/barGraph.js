// const data = [
//   { state: "Alabama", gas: 5000, ev: 1000 },
//   { state: "Alaska", gas: 3000, ev: 500 },
//   { state: "Arizona", gas: 7000, ev: 2000 },
// ];

function loadBarGraphData() {
  const data = [];
  var states = Object.keys(vehicleData);
  for (let i = 0; i < states.length; i++) {
    let obj = {}
    obj.state = states[i];
    obj.ev = vehicleData[states[i]][currentYear]["EVT"] / populationData[states[i]][currentYear] * 1000;
    obj.gas = (vehicleData[states[i]][currentYear]["Gas"] + vehicleData[states[i]][currentYear]["Diesel"]) / populationData[states[i]][currentYear] * 1000;
    // if (vehicleType.length == 16)
    //   continue;
    data.push(obj);
  }
  return data;
};

function drawBarGraph(data, svgSelector, width, height) {
  const svg = d3.select(svgSelector)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg.selectAll("*").remove();

  const margin = { top: 20, right: 30, bottom: 50, left: 100 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // y axis
  const y = d3.scaleBand()
    .domain(data.map(d => d.state))
    .range([0, chartHeight])
    .padding(0.2);

  // x axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.gas + d.ev)])
    .nice()
    .range([0, chartWidth]);

  // color reflection
  const color = d3.scaleOrdinal()
    .domain(["GAS", "EV"])
    .range(["#E05252", "#66FF66"]);

  // bar
  data.forEach(d => {
    const group = g.append("g")
      .attr("transform", `translate(0, ${y(d.state)})`);

    // Gas red
    group.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", x(d.gas))
      .attr("height", y.bandwidth())
      .attr("fill", color("GAS"));

    // EV blue
    group.append("rect")
      .attr("x", x(d.gas))
      .attr("y", 0)
      .attr("width", x(d.ev))
      .attr("height", y.bandwidth())
      .attr("fill", color("EV"));
  });

  g.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y));
}
