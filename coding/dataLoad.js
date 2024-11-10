var vehicleData = {};

// load vehicle data from sheets
function loadVehicleData() {
  axios.get('./data/ev_data.xlsx', { responseType: 'arraybuffer' })
    .then(response => {
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const header = jsonData[0]; // first line is head
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const state = row[0]; // get name of state
        vehicleData[state] = {};

        for (let j = 1; j < header.length; j++) {
          const year = header[j]; // get year
          vehicleData[state][year] = row[j]; // get the number of EV in the corresponding year
        }
      }
      drawBubbles();
    })
    .catch(error => {
      console.error("Error loading Excel file:", error);
    });
}