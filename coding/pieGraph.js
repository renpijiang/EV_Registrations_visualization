// data = [
//     { vehicleType: "EV", value: 3000 },
//     { vehicleType: "PHEV", value: 2000 },
//     { vehicleType: "HEV", value: 5000 },
//     { vehicleType: "GAS", value: 10000 }
// ];


function loadPieGraphData(stateName, yearScale) {
    const data = [];
    for (let i = 1; i < vehicleType.length; i++) {
        let obj = {}
        obj.vehicleType = vehicleType[i];
        obj.value = vehicleData[stateName][yearScale][vehicleType[i]];
        data.push(obj); // 使用 push() 来添加到 data 数组
    }
    return data;
};


function drawPieGraph(data, svgSelector, width, height) {
    // 选择 SVG 元素
    const svg = d3.select(svgSelector)
        .attr("width", width)
        .attr("height", height);

    // 设置边距和半径
    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    const radius = Math.min(width, height) / 2 - Math.max(margin.left, margin.right);

    // 清空之前的内容（如果有）
    svg.selectAll("*").remove();

    // 创建一个组元素，居中饼状图
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // 选择一个更合适的颜色方案，如 d3.schemeSet3
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.vehicleType))  // 确保映射到车辆类型
        .range(d3.schemeSet3);  // 或者选择更大的颜色范围，如 d3.schemeCategory20


    // 创建饼图生成器
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // 创建弧生成器
    const arc = d3.arc()
        .innerRadius(0)  // 内径为0，表示实心饼图
        .outerRadius(radius);  // 外径为半径

    // 绑定数据并绘制弧形
    const arcs = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    // 绘制每个弧形区域
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.type));

    // 添加每个弧形的标签（类型 + 百分比）
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d => `${d.data.type}: ${((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(1)}%`);
}
