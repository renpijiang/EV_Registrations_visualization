var map;
var currentYear = 2023;
var currentState = "Alabama";

main();

// website entrance
function main() {

    // Load data
    loadVehicleData();
    loadGeoData();
    loadPopulationData();

    initializeMap();

    renderingWeb();

    registerUserInputMonitors();
}

async function renderingWeb() {

    await waitForDataLoad(() => vehicleDataReady);
    await waitForDataLoad(() => geoDataReady);
    console.log("Start rendering web UI");

    // 调用函数绘制折线图
    // TODO:
    //var stateName = readUserInput();

    drawLineGraph(loadLineGraphData(currentState, "EVT"), "#lineGraph", 400, 400);
    drawBubbles();
    drawPieGraph(loadPieGraphData(currentState, currentYear), "#pieGraph", 400, 400);
    drawBarGraph(loadBarGraphData(currentYear), "#barGraph", 400, 800);
}