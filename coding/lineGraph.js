// function loadLineGraphData() {
//   const stateName = "Wyoming";  // 选择你想要的州
//   const data = [];

// }
const data = [
  { year: 2016, value: 72900 },
  { year: 2017, value: 77400 },
  { year: 2018, value: 80200 },
  { year: 2019, value: 83500 },
  { year: 2020, value: 86000 },
  { year: 2021, value: 83200 },
  { year: 2022, value: 86000 },
  { year: 2023, value: 89200 }
];

// 调用函数绘制折线图
drawLineGraph(data, "svg", 800, 400);

function drawLineGraph(data, svgSelector, width, height) {
  // 选择 SVG 元素
  const svg = d3.select(svgSelector);

  // 设置边距
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };

  // 计算内容区域的宽度和高度
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 清空之前的内容（如果有）
  svg.selectAll("*").remove();

  // 添加一个组元素并考虑边距
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // 将字符串日期转换为日期对象，将数值转为数字
  data.forEach(d => {
    d.year = +d.year;
    d.value = +d.value;
  });

  // 设定时间轴的范围（x轴）
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  // 设定 y 轴的范围（y轴）
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([innerHeight, 0]);

  // 使用 d3.line 生成器绘制路径
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value));

  // 绘制线条路径
  g.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-width", 2);

  // 绘制 x 轴
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x)
      .ticks(data.length)   // 保证刻度和年份一致
      .tickFormat(d3.format("d")) // 保证刻度为整数
    );

  // 绘制 y 轴
  g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
}



