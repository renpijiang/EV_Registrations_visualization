async function registerUserInputMonitors() {

  await waitForDataLoad(() => vehicleDataReady);
  await waitForDataLoad(() => geoDataReady);
  console.log("Start registering user input monitors.");

  rergisterYearMonitor();
  registerStateMonitor();
}

// Monitor the change of year 
function rergisterYearMonitor() {
  document.getElementById("yearSelect").addEventListener("change", function () {
    if (this.value != currentYear) {
      currentYear = this.value;
      drawBubblesForYear(currentYear, vehicleData, "EVT");  // Update the bubbles based on the selected year
    }
  });
}

// Monitor the change of state 
// Monitor the change of state selection
function registerStateMonitor() {
  const stateSelect = document.getElementById('stateSelect');
  stateSelect.innerHTML = ''; // 清空现有选项

  // 从 vehicleData 获取所有州名
  const states = Object.keys(vehicleData);

  // Populate the state selector with states
  states.forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
  document.getElementById("stateSelect").addEventListener("change", function () {
    if (this.value != currentState) {
      currentState = this.value;
      drawLineGraph(loadLineGraphData(currentState, "EVT"), "svg", 800, 400);
    }
  });
}