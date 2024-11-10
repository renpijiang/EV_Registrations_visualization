// get bubble color according to amount of EV
function getColor(d) {
  return d > 5000000 ? '#800026' :
    d > 4000000 ? '#BD0026' :
      d > 3000000 ? '#E31A1C' :
        d > 2000000 ? '#FC4E2A' :
          d > 1000000 ? '#FD8D3C' :
            '#FFEDA0';
}

// get bubble size according to amount of EV
function getRadius(d) {
  return d > 5000000 ? 50 :
    d > 4000000 ? 40 :
      d > 3000000 ? 30 :
        d > 2000000 ? 20 :
          d > 1000000 ? 15 :
            10;  // Minimum size
}

// avoid map duplicate 
var map;
if (!map) {
  map = L.map('map').setView([37.8, -96], 4);  // set the initial view of the map
}

// add map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
}).addTo(map);

// load Excel from Local server
axios.get('/ev_data.xlsx', { responseType: 'arraybuffer' })
  .then(response => {
    const data = new Uint8Array(response.data);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Format data by year and state classification
    const evData = {};

    const header = jsonData[0]; // first line is head
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      const state = row[0]; // get name of state
      evData[state] = {};

      for (let j = 1; j < header.length; j++) {
        const year = header[j]; // get year
        evData[state][year] = row[j]; // get the number of EV in the corresponding year
      }
    }

    // load GeoJSON data
    axios.get('/coding/ne_10m_admin_1_states_provinces (1).json').then(response => {
      var geojsonData = response.data;

      // Filter out states in the USA
      var usStates = {
        "type": "FeatureCollection",
        "features": geojsonData.features.filter(function (feature) {
          return feature.properties.admin === "United States of America";
        })
      };

      // Default selected year
      var selectedYear = 2023;

      // Function to add circle markers (bubbles) for each state
      function addBubbles(year, evData) {
        // First clear existing layers if any
        if (map.bubblesLayer) {
          map.removeLayer(map.bubblesLayer);
        }

        // Create a new layer for bubbles
        map.bubblesLayer = L.layerGroup().addTo(map);

        usStates.features.forEach(function (feature) {
          var stateName = feature.properties.name;
          var evRegistrations = evData[stateName] && evData[stateName][year] || 0; // default 0

          // Find the state's centroid or representative point
          var center = L.geoJson(feature).getBounds().getCenter();

          // Add a circle marker (bubble)
          L.circleMarker(center, {
            radius: getRadius(evRegistrations),  // Size of the bubble
            fillColor: getColor(evRegistrations),  // Color based on EV numbers
            color: '#000',  // Optional border color
            weight: 1,
            fillOpacity: 0.7
          }).bindPopup(`<strong>${stateName}</strong><br>EV Registrations: ${evRegistrations}`).addTo(map.bubblesLayer);
        });
      }

      // Initially add bubbles for the default year
      addBubbles(selectedYear, evData);

      // Monitor the change of year 
      document.getElementById("yearSelect").addEventListener("change", function () {
        selectedYear = this.value;
        addBubbles(selectedYear, evData);  // Update the bubbles based on the selected year
      });

    }).catch(error => {
      console.error("Error loading GeoJSON:", error);
    });
  })
  .catch(error => {
    console.error("Error loading Excel file:", error);
  });