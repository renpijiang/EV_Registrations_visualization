/////////////////////////////////
//        VEHICLE DATA         //
/////////////////////////////////

var yearScale = [];
var vehicleData = {};
var vehicleDataReady = false;

// load vehicle data from sheets
function loadVehicleData() {
  axios.get('./data/ev_data.xlsx', { responseType: 'arraybuffer' })
    .then(response => {
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      yearScale = jsonData[0]; // first line is head
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const state = row[0]; // get name of state
        vehicleData[state] = {};

        for (let j = 1; j < yearScale.length; j++) {
          const year = yearScale[j]; // get year
          vehicleData[state][year] = row[j]; // get the number of EV in the corresponding year
        }
      }

      vehicleDataReady = true;
      console.log("Vehicle data was loaded successfully!");
    })
    .catch(error => {
      console.error("Error loading Excel file:", error);
    });
}

/////////////////////////////////
//         GEO DATA            //
/////////////////////////////////

var usStateGeo = {}; // US states geo data
var usCountyGeo = {}; // US countries geo data
var geoDataReady = false;

function loadGeoData() {
  // load GeoJSON data
  axios.get('/data/states_geo.json').then(response => {
    var geojsonData = response.data;

    // Filter out states in the USA
    usStateGeo = {
      "type": "FeatureCollection",
      "features": geojsonData.features.filter(function (feature) {
        return feature.properties.admin === "United States of America";
      })
    };

    geoDataReady = true;
    console.log("States geo data was loaded successfully!");
  }).catch(error => {
    console.error("Error loading GeoJSON:", error);
  });
}





function waitForDataLoad(conditionFunc) {
  return new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      if (conditionFunc()) {
        clearInterval(intervalId);
        resolve();
      }
    }, 100);
  })
}