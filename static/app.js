// app.js

const url = "http://127.0.0.1:5000/";

// fetch data from the Flask API endpoint
fetch(url)
  .then(response => response.json())
  .then(fetchedData => {
    // store the fetched data in the 'data' variable
    const data = fetchedData;
  
    // creates instance of unique values, removes duplicates
    const airportNames = [...new Set(data.map(item => item.airport_name))];
    const carrierNames = [...new Set(data.map(item => item.carrier_name))];

    // updates charts based on selected values
    function updateCharts(selectedAirport, selectedCarrier) {
      // Filters data by selected airport and airline
      const filteredData = data.filter(item => {
        return (
          (selectedAirport === "" || item.airport_name === selectedAirport) &&
          (selectedCarrier === "" || item.carrier_name === selectedCarrier)
        );
      });

      // combines values based on selection and stores them into variables
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
      };

      // updates info box in html with selected data
      updateInfoBox(combinedData);

      // creates pie chart based on selected data
      createPieChart(combinedData);
        function createPieChart(combinedData) {
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
          ((combinedData.Total_On_Time / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Crew_Delay / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Weather_Delay / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Traffic_Delay / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Security_Cancelled / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Late_Aircraft_Delay / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Cancelled / combinedData.Total_Flights) * 100).toFixed(2),
          ((combinedData.Diverted / combinedData.Total_Flights) * 100).toFixed(2),
        ];
        let pieChart = {
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
        };
        const ctx = document.getElementById("pieChart").getContext("2d");
        // destroys previous chart and creats new one off of newly selected filters

        if (Chart.getChart("pieChart")){
          Chart.getChart("pieChart").destroy();
        }
        pieChart = new Chart(ctx, pieChart);
      }
      console.log("Combined Data:", combinedData);
    }

    // stores html element into infoBox variable 
    function updateInfoBox(selectedData) {
      const infoBox = d3.select("#info-box");
      // sets as empty string before updating
      infoBox.html(""); 

      // rounds values to nearest whole number and appends the values to the info box using key value pairs
      for (const [key, value] of Object.entries(selectedData)) {
        const roundedValue = typeof value === "number" ? value.toFixed(0) : value;
        infoBox.append("p").text(`${key}: ${roundedValue}`);
      }
    }

    ///creating dropdown menus that dynamicly update data

    // dropdown is created and populated from values in options array
    function createDropdown(id, options, onChangeCallback) {
      const dropdown = d3.select(`#${id}`);

      dropdown
        .selectAll("option")
        .data(options)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

        //adds event listener to dropdown, listening for when different option in dropdown is chosen
      dropdown.on("change", function () {
        const selectedValue = this.value;
        onChangeCallback(selectedValue);
      });
    }

    // populates dropdown based off called array, calls updateCharts function
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