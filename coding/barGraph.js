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
    data.push(obj); // 使用 push() 来添加到 data 数组
  }
  return data;
};

function drawBarGraph(data, svgSelector, width, height) {
  const svg = d3.select(svgSelector)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg.selectAll("*").remove();  // 清空之前的图形

  const margin = { top: 20, right: 30, bottom: 50, left: 100 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // y 轴表示每个州
  const y = d3.scaleBand()
    .domain(data.map(d => d.state))
    .range([0, chartHeight])
    .padding(0.2);

  // x 轴表示比例
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.gas + d.ev)])  // 堆叠后的最大值
    .nice()
    .range([0, chartWidth]);

  // 颜色映射
  const color = d3.scaleOrdinal()
    .domain(["GAS", "EV"])
    .range(["#FF6666", "#66FF66"]);

  // 绘制柱子
  data.forEach(d => {
    const group = g.append("g")
      .attr("transform", `translate(0, ${y(d.state)})`);

    // Gas 部分（红色）
    group.append("rect")
      .attr("x", 0)
      .attr("y", 0)  // 从顶部开始
      .attr("width", x(d.gas))
      .attr("height", y.bandwidth())
      .attr("fill", color("GAS"));

    // EV 部分（蓝色）
    group.append("rect")
      .attr("x", x(d.gas))  // 在 Gas 的基础上堆叠
      .attr("y", 0)
      .attr("width", x(d.ev))
      .attr("height", y.bandwidth())
      .attr("fill", color("EV"));
  });

  // 添加x轴
  g.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(x));

  // 添加y轴
  g.append("g")
    .call(d3.axisLeft(y));
}
