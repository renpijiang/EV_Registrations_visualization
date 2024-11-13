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
      // 遍历所有的 Sheet 表，每个表表示一个年份
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const year = sheetName;  // 将表名（比如2023，2022等）作为年份
        yearScale[yearIndex] = sheetName;
        yearIndex = yearIndex + 1;
        const vehicleTypes = jsonData[0]; // 第一行是车辆类型（比如EV, PHEV, GAS等）
        vehicleType = vehicleTypes.slice(1); // 第一列是州名，所以跳过它

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const state = row[0]; // 每一行的第一个值是州名

          if (!vehicleData[state]) { // 如果vehicleData还没有该州的数据，则初始化该州
            vehicleData[state] = {};
          }

          if (!vehicleData[state][year]) { // 如果该州还没有该年的数据，初始化该年
            vehicleData[state][year] = {};
          }

          for (let j = 1; j < vehicleTypes.length; j++) { // 从第二列开始遍历，第一列是州名
            const vehicleType = vehicleTypes[j]; // 车辆类型（EV, PHEV, HEV, GAS等
            vehicleData[state][year][vehicleType] = row[j]; // 将数据赋值到对应的州、年份、车辆类型下
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
