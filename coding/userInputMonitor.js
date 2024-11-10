function registerUserInputMonitors()
{
    rergisterYearMonitor();
    registerStateMonitor();
}

// Monitor the change of year 
function rergisterYearMonitor()
{
  document.getElementById("yearSelect").addEventListener("change", function () {
    if (this.value != selectedYear) {
      selectedYear = this.value;
      drawBubblesForYear(selectedYear, vehicleData);  // Update the bubbles based on the selected year
    }
  });
}

// Monitor the change of state 
function registerStateMonitor()
{
  // TODO: 
  // draw pie graph
  // draw line graph
}