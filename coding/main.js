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

async function renderingWeb(){

    await waitForDataLoad(()=>vehicleDataReady);
    await waitForDataLoad(()=>geoDataReady);
    console.log("Start rendering web UI");

    drawBubbles();
}