// app.js

const airport = "http://127.0.0.1:5000";

d3.json(airport).then((data) => {
  console.log(data.airport)
  const select = d3.select("#selDataset");
  select.selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .attr("value", d => d.airport )
    .text(d => d.airport);
})

const line_chart =  "http://127.0.0.1:5000/lineAndBar_charts"

d3.json(line_chart).then((data) => {

   
    const months = data.map(item => item.month);
    console.log(months)
    const totalFlights = data.map(item => item.total_flights);
    const carrier_name = data.map(item =>item.carrier_name)
    const trace1 = {
      x: months,
      y: totalFlights, 
      labels: carrier_name,
      type: 'bar',
      hoverinfo: 'labels', 
      text: carrier_name
    };

    const layout = {
      title: 'Total Flights throughout the year<br> for major airlines',
      xaxis: {
        title: 'Month',
        dtick: 1
      },
      yaxis: {
        title: 'Total Flights'
      }
    };

    Plotly.newPlot('curve', [trace1], layout);

    const averageCarrier_ct = data.map(item => item.avg_carrierct);
    const avg_weather_ct = data.map(item => item.avg_weather_ct);
    // const carrier_name = data.map(item =>item.carrier_name)
    month = [];
    for(let i = 0 ; i < data.lenght; i ++){
      if(month )
    }
    var trace2 = {
      x: months.reverse(),
      y: avg_weather_ct.slice(0, 4),
      mode: 'lines+markers',
      line: {shape: 'hv'},
      type: 'scatter'
    };
    var trace3 = {
      x: months,
      y: averageCarrier_ct,
      mode: 'lines+markers',
      line: {shape: 'hv'},
      type: 'scatter'
    };
    Plotly.newPlot('spline', [trace2]);

})






























// // Fetch data from the Flask API endpoint
// fetch(url)
//   .then(response => response.json())
//   .then(fetchedData => {
//     // Store the fetched data in the 'data' variable
//     const data = fetchedData;

//     // Extract unique airport names and carrier names from the data
//     const airportNames = [...new Set(data.map(item => item.airport_name))];
//     const carrierNames = [...new Set(data.map(item => item.carrier_name))];

//     // Function to update charts based on selected values
//     function updateCharts(selectedAirport, selectedCarrier) {
//       // Filter data based on the selected airport and carrier
//       const filteredData = data.filter(item => {
//         return (
//           (selectedAirport === "" || item.airport_name === selectedAirport) &&
//           (selectedCarrier === "" || item.carrier_name === selectedCarrier)
//         );
//       });

//       // Combine the rest of the datapoints for the selected airport or carrier
//       const combinedData = {
//         Airport: selectedAirport,
//         Airline: selectedCarrier,
//         Total_Flights: d3.sum(filteredData, d => d.arr_flights),
//         Crew_Delay: d3.sum(filteredData, d => d.carrier_ct),
//         Weather_delay: d3.sum(filteredData, d => d.weather_ct),
//         Traffic_Delay: d3.sum(filteredData, d => d.nas_ct),
//         Security_Cancelled: d3.sum(filteredData, d => d.security_ct),
//         Late_Aircraft_Delay: d3.sum(filteredData, d => d.late_aircraft_ct),
//         Cancelled: d3.sum(filteredData, d => d.arr_cancelled),
//         Diverted: d3.sum(filteredData, d => d.arr_diverted),
//         Minutes_Delayed: d3.sum(filteredData, d => d.arr_delay),
//          // You can add more fields here as needed...
//       };

//       // Update the info box with the selected data
//       updateInfoBox(combinedData);

//       // You can implement the chart updating logic here based on the combinedData
//       // For simplicity, I'm just logging the combinedData
//       console.log("Combined Data:", combinedData);
//     }

//     // Function to update the info box with the selected data
//     function updateInfoBox(selectedData) {
//       const infoBox = d3.select("#info-box");
//       infoBox.html(""); // Clear previous content

//       // Create paragraphs with data for the info box
//       for (const [key, value] of Object.entries(selectedData)) {
//         const roundedValue = typeof value === "number" ? value.toFixed(0) : value;
//         infoBox.append("p").text(`${key}: ${roundedValue}`);
//       }
//     }

//     // Function to create and populate a dropdown menu
//     function createDropdown(id, options, onChangeCallback) {
//       const dropdown = d3.select(`#${id}`);

//       dropdown
//         .selectAll("option")
//         .data(options)
//         .enter()
//         .append("option")
//         .attr("value", d => d)
//         .text(d => d);

//       dropdown.on("change", function () {
//         const selectedValue = this.value;
//         onChangeCallback(selectedValue);
//       });
//     }

//     // Create and populate the airport and carrier dropdown menus
//     createDropdown("airport-select", ["", ...airportNames], selectedAirport => {
//       const selectedCarrier = d3.select("#carrier-select").node().value;
//       updateCharts(selectedAirport, selectedCarrier);
//     });

//     createDropdown("carrier-select", ["", ...carrierNames], selectedCarrier => {
//       const selectedAirport = d3.select("#airport-select").node().value;
//       updateCharts(selectedAirport, selectedCarrier);
//     });
//   })
//   .catch(error => {
//     console.error("Error fetching data:", error);
//   });

