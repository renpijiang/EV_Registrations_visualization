var map;
var currentYear = 2023;
var currentState = "Alabama";
main();

// website entrance
function main() {

    // Load data
    loadVehicleData();

    loadGeoData();

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
    //drawLineGraph(loadLineGraphData(stateName), "svg", 800, 400);
    drawLineGraph(loadLineGraphData(currentState, "EVT"), "svg", 800, 400);
    drawBubbles();
    drawPieGraph(loadPieGraphData(currentState, currentYear), "svg", 800, 400);
}