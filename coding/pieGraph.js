// data = [
//     { vehicleType: "EV", value: 3000 },
//     { vehicleType: "PHEV", value: 2000 },
//     { vehicleType: "HEV", value: 5000 },
//     { vehicleType: "GAS", value: 10000 }
// ];


function loadPieGraphData(stateName, yearScale) {
    const data = [];
    let obj = {}
    obj.vehicleType = "Other";
    obj.value = 0;


    data[0] = obj;
    for (let i = 1; i < vehicleType.length - 5; i++) {
        obj = {}
        obj.vehicleType = vehicleType[i];
        obj.value = vehicleData[stateName][yearScale][vehicleType[i]];

        if (obj.value / vehicleData[stateName][yearScale]["EVT"] < 0.005) {
            data[0].value = data[0].value + obj.value;
        }
        else {
            data.push(obj);
        }
    }

    //  "Other" range
    if (data[0].value / d3.sum(data, d => d.value) < 0.005) {
        data.splice(0, 1);
    }
    const nonOtherData = data.filter(d => d.vehicleType !== "Other");
    if (d3.sum(nonOtherData, d => d.value) / d3.sum(data, d => d.value) < 0.005) {
        return [{ vehicleType: "Other", value: d3.sum(data, d => d.value) }];
    }


    return data;
};


function drawPieGraph(data, svgSelector, width, height) {
    // SVG 
    const svg = d3.select(svgSelector)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);  // viewBox

    // update radius
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    const radius = Math.min(width - margin.right - margin.left, height - margin.top - margin.bottom) / 2;

    // clear previous data 
    svg.selectAll("*").remove();

    // Create an element for svg
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);


    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.vehicleType))
        .range(d3.schemeSet3);


    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // arc 
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);


    const arcs = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    // pie area
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.vehicleType));

    const lines = g.selectAll(".lines")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "lines");

    // line
    lines.append("polyline")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("points", d => {
            const posA = arc.centroid(d);
            const posB = outerArc.centroid(d);
            const posC = outerArc.centroid(d);


            if (smallSlice(d)) {
                posC[0] = -radius * 1.2;
            } else {
                posC[0] = radius * 1.2 * (midAngle(d) < Math.PI ? 1 : -1);
            }
            return [posA, posB, posC];
        });


    arcs.append("text")
        .attr("transform", d => {
            const pos = outerArc.centroid(d);


            if (smallSlice(d)) {
                pos[0] = -radius * 1.25;
            } else {

                pos[0] = radius * 1.25 * (midAngle(d) < Math.PI ? 1 : -1);
            }
            return `translate(${pos})`;
        })
        .attr("text-anchor", d => smallSlice(d) ? "end" : (midAngle(d) < Math.PI ? "start" : "end"))  // 小百分比左侧对齐，其他根据中间角度
        .attr("font-size", "12px")
        .text(d => `${d.data.vehicleType}: ${(d.data.value / d3.sum(data, d => d.value) * 100).toFixed(1)}%`);

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    function smallSlice(d) {
        return (d.endAngle - d.startAngle) < 0.2;  // 如果片段的角度小于 0.15 弧度，认为它是小片段
    }
}