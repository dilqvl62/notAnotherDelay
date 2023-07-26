// app.js

const url = "http://127.0.0.1:5000/";

// Assume you have already fetched the data and stored it in the 'data' variable

// Function to update charts based on selected values
function updateCharts(selectedAirport, selectedCarrier) {
  // Filter data based on the selected airport and carrier
  const filteredData = data.filter(item => {
    return (
      (selectedAirport === "" || item.airport_name === selectedAirport) &&
      (selectedCarrier === "" || item.carrier_name === selectedCarrier)
    );
  });

  // Combine the rest of the datapoints for the selected airport or carrier
  const combinedData = {
    airport: selectedAirport,
    carrier: selectedCarrier,
    arr_cancelled: d3.sum(filteredData, d => d.arr_cancelled),
    arr_del15: d3.sum(filteredData, d => d.arr_del15),
    arr_delay: d3.sum(filteredData, d => d.arr_delay),
    arr_diverted: d3.sum(filteredData, d => d.arr_diverted),
    arr_flights: d3.sum(filteredData, d => d.arr_flights),
    // You can add more fields here as needed...
  };

  // You can implement the chart updating logic here based on the combinedData
  // For simplicity, I'm just logging the combinedData
  console.log("Combined Data:", combinedData);
}

// Function to create and populate a dropdown menu
function createDropdown(id, options, onChangeCallback) {
  const dropdown = d3.select(`#${id}`);

  dropdown
    .selectAll("option")
    .data(options)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  dropdown.on("change", function () {
    const selectedValue = this.value;
    onChangeCallback(selectedValue);
  });
}

// Fetch data from the Flask API endpoint
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Store the fetched data in the 'data' variable
    const airportNames = [...new Set(data.map(item => item.airport_name))];
    const carrierNames = [...new Set(data.map(item => item.carrier_name))];

    // Create and populate the airport and carrier dropdown menus
    createDropdown("airport-select", ["", ...airportNames], selectedAirport => {
      const selectedCarrier = d3.select("#carrier-select").node().value;
      updateCharts(selectedAirport, selectedCarrier);
    });

    createDropdown("carrier-select", ["", ...carrierNames], selectedCarrier => {
      const selectedAirport = d3.select("#airport-select").node().value;
      updateCharts(selectedAirport, selectedCarrier);
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });