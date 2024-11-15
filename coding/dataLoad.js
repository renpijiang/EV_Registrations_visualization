/////////////////////////////////
//        VEHICLE DATA         //
/////////////////////////////////

var yearScale = [];
var vehicleData = {};
var vehicleType = [];
//vehicleData = {
//    Washington = {
//      2016 = {
//          EV= 3000},
//          PHEV = 3000},
//          HEV = 3000},
//          GAS = 3000},
//      },
//      2017 = {
//          EV= 3000},
//          PHEV = 3000},
//          HEV = 3000},
//          GAS = 3000},
//      },
//    },
//    Utah = {
//      2016 = {
//          EV= 3000},
//          PHEV = 3000},
//          HEV = 3000},
//          GAS = 3000},
//      },
//      2017 = {
//          EV= 3000},
//          PHEV = 3000},
//          HEV = 3000},
//          GAS = 3000},
//      },
//    },
//}

var vehicleDataReady = false;

// load vehicle data from sheets
function loadVehicleData() {
  axios.get('/data/each_states_vehicle.xlsx', { responseType: 'arraybuffer' })
    .then(response => {
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });

      var yearIndex = 0;
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const year = sheetName;
        yearScale[yearIndex] = sheetName;
        yearIndex = yearIndex + 1;
        const vehicleTypes = jsonData[0];
        vehicleType = vehicleTypes.slice(1);

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const state = row[0];

          if (!vehicleData[state]) {
            vehicleData[state] = {};
          }

          if (!vehicleData[state][year]) {
            vehicleData[state][year] = {};
          }

          for (let j = 1; j < vehicleTypes.length; j++) {
            const vehicleType = vehicleTypes[j];
            vehicleData[state][year][vehicleType] = row[j];
          }
        }
      });

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

/////////////////////////////////
//      POPULATION DATA        //
/////////////////////////////////
var populationData = {};
var polulationDataReady = false;

function loadPopulationData() {
  axios.get('/data/population_data.xlsx', { responseType: 'arraybuffer' })
    .then(response => {
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const header = jsonData[0];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const state = row[0]; // get name of state
        populationData[state] = {};

        for (let j = 1; j < header.length; j++) {
          const year = header[j]; // get year
          populationData[state][year] = row[j];
        }
      }
      polulationDataReady = true;
      console.log("Population data was loaded successfully!");
    })
    .catch(error => {
      console.error("Error loading Excel file:", error);
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
