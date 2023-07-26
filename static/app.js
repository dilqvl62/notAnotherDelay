// app.js

const url = "http://127.0.0.1:5000/";

// Fetch data from the Flask API endpoint
fetch(url)
  .then(response => response.json())
  .then(fetchedData => {
    // Store the fetched data in the 'data' variable
    const data = fetchedData;

    // Extract unique airport names and carrier names from the data
    const airportNames = [...new Set(data.map(item => item.airport_name))];
    const carrierNames = [...new Set(data.map(item => item.carrier_name))];

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
        Airport: selectedAirport,
        Airline: selectedCarrier,
        Total_Flights: d3.sum(filteredData, d => d.arr_flights),
        Total_Delays_Cancellations:
        d3.sum(filteredData, d => d.carrier_ct) +
        d3.sum(filteredData, d => d.weather_ct) +
        d3.sum(filteredData, d => d.nas_ct) +
        d3.sum(filteredData, d => d.security_ct) +
        d3.sum(filteredData, d => d.late_aircraft_ct) +
        d3.sum(filteredData, d => d.arr_cancelled) +
        d3.sum(filteredData, d => d.arr_diverted),
        Total_On_Time: d3.sum(filteredData, d => d.arr_flights) - (
          d3.sum(filteredData, d => d.carrier_ct) +
          d3.sum(filteredData, d => d.weather_ct) +
          d3.sum(filteredData, d => d.nas_ct) +
          d3.sum(filteredData, d => d.security_ct) +
          d3.sum(filteredData, d => d.late_aircraft_ct) +
          d3.sum(filteredData, d => d.arr_cancelled) +
          d3.sum(filteredData, d => d.arr_diverted)
        ),
        Crew_Delay: d3.sum(filteredData, d => d.carrier_ct),
        Weather_Delay: d3.sum(filteredData, d => d.weather_ct),
        Traffic_Delay: d3.sum(filteredData, d => d.nas_ct),
        Security_Cancelled: d3.sum(filteredData, d => d.security_ct),
        Late_Aircraft_Delay: d3.sum(filteredData, d => d.late_aircraft_ct),
        Cancelled: d3.sum(filteredData, d => d.arr_cancelled),
        Diverted: d3.sum(filteredData, d => d.arr_diverted),
        Minutes_Delayed: d3.sum(filteredData, d => d.arr_delay),
        Minutes_Waited_Per_Delay: d3.sum(filteredData, d => d.arr_delay) / (
        d3.sum(filteredData, d => d.carrier_ct) +
        d3.sum(filteredData, d => d.weather_ct) +
        d3.sum(filteredData, d => d.nas_ct) +
        d3.sum(filteredData, d => d.security_ct) +
        d3.sum(filteredData, d => d.late_aircraft_ct)
        )
         // You can add more fields here as needed...
      };

      // Update the info box with the selected data
      updateInfoBox(combinedData);

      // Create and update the pie chart
  createPieChart(combinedData);
}

// Function to create and update the pie chart
function createPieChart(combinedData) {
  // Extract the delay categories and corresponding data
  const delayCategories = [
    "On Time",
    "Crew Delay",
    "Weather Delay",
    "Traffic Delay",
    "Security Cancelled",
    "Late Aircraft Delay",
    "Cancelled",
    "Diverted",
  ];

  const delayData = [
    combinedData.Total_On_Time,
    combinedData.Crew_Delay,
    combinedData.Weather_Delay,
    combinedData.Traffic_Delay,
    combinedData.Security_Cancelled,
    combinedData.Late_Aircraft_Delay,
    combinedData.Cancelled,
    combinedData.Diverted,
  ];

  // Get the canvas element for the pie chart
  const ctx = document.getElementById("pie-chart").getContext("2d");

  // Create the pie chart
  const pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: delayCategories,
      datasets: [
        {
          data: delayData,
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4bc0c0",
            "#9966ff",
            "#ff9999",
            "#aaff99",
            "#9E9E9E"
          ],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        position: "right",
      },
    },
  });


      // You can implement the chart updating logic here based on the combinedData
      // For simplicity, I'm just logging the combinedData
      console.log("Combined Data:", combinedData);
    }

    // Function to update the info box with the selected data
    function updateInfoBox(selectedData) {
      const infoBox = d3.select("#info-box");
      infoBox.html(""); // Clear previous content

      // Create paragraphs with data for the info box
      for (const [key, value] of Object.entries(selectedData)) {
        const roundedValue = typeof value === "number" ? value.toFixed(0) : value;
        infoBox.append("p").text(`${key}: ${roundedValue}`);
      }
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