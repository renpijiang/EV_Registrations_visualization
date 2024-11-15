function initializeMap() {
  // avoid map duplicate 
  if (!map) {
    map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
    }).setView([37.8, -96], 4);  // set the initial view of the map
  }
  // Add zoom control
  L.control.zoom({
    position: 'topright' // This puts the zoom control in the top-right corner
  }).addTo(map);

  // add map layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  }).addTo(map);

}

function drawBubbles() {
  try {
    // Initially add bubbles for the default year
    drawBubblesForYear(currentYear, vehicleData, "EVT");
  } catch (error) {
    console.log(error);
  }

}

// Function to add circle markers (bubbles) for each state
function drawBubblesForYear(year, data, vehicleType) {
  // First clear existing layers if any
  if (map.bubblesLayer) {
    map.removeLayer(map.bubblesLayer);
  }

  // Create a new layer for bubbles
  map.bubblesLayer = L.layerGroup().addTo(map);

  usStateGeo.features.forEach(function (feature) {
    var stateName = feature.properties.name;
    var evRegistrations = data[stateName] && data[stateName][year] && data[stateName][year][vehicleType] || 0; // default 0
    var totalRegistrations = data[stateName] && data[stateName][year] && data[stateName][year]["Total"] || 1; // default 0
    // Find the state's centroid or representative point
    var center = L.geoJson(feature).getBounds().getCenter();

    // Add a circle marker (bubble)
    // color represent the EV proportion  radius represent the quantity
    L.circleMarker(center, {
      radius: getRadius(evRegistrations),  // Size of the bubble
      fillColor: getColor(evRegistrations / totalRegistrations),  // Color based on EV numbers
      color: "none",  // Optional border color
      weight: 1,
      fillOpacity: 0.7
    }).bindPopup(`<strong>${stateName}</strong><br>EV Registration Counts: ${evRegistrations}</strong><br>Percent: ${evRegistrations / totalRegistrations}`).addTo(map.bubblesLayer);
  });
}

// get bubble color according to amount of EV
function getColor(d) {
  return d > 0.15 ? '#800026' :
    d > 0.13 ? '#BD0026' :
      d > 0.12 ? '#E31A1C' :
        d > 0.11 ? '#FC4E2A' :
          d > 0.10 ? '#FD8D3C' :
            '#FFEDA0';
}

// get bubble size according to amount of EV
function getRadius(d) {
  let radius = d > 5000000 ? 50 :
    d > 4000000 ? 45 :
      d > 3000000 ? 40 :
        d > 2000000 ? 35 :
          d > 1000000 ? 30 :
            20;
  return radius;// Minimum size
}