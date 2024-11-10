var map;

main();

// website entrance
function main() {

    // Load data
    loadVehicleData();
    loadGeoData();

    initializeMap();

    renderingWeb();
}

async function renderingWeb() {

    await waitForDataLoad(() => vehicleDataReady);
    await waitForDataLoad(() => geoDataReady);
    console.log("Start rendering web UI");

    // 调用函数绘制折线图
    // TODO:
    //var stateName = readUserInput();
    //drawLineGraph(loadLineGraphData(stateName), "svg", 800, 400);
    drawLineGraph(loadLineGraphData("Utah"), "svg", 800, 400);
    drawBubbles();

    registerUserInputMonitors();
}