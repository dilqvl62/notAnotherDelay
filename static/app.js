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

})

const spline = "http://127.0.0.1:5000/major_airlines"; 

d3.json(spline).then((data) =>{
 
  var months = [];
  var avgNasct = [];
  var avgCarrierCt = [];
  var avgWeatherCt = [];
for (let i =0 ; i < data.length; i ++){
  months.push(data[i].month);
  avgNasct.push(data[i].average_nasct);
  avgCarrierCt.push(data[i].avg_carrier_ct);
  avgWeatherCt.push(data[i].avg_weather_ct);
}
//Create the line chart using Plotly
const chartData = [
  { x: months, y: avgNasct, type: 'scatter', mode: 'lines', name: 'average_nasct' },
  { x: months, y: avgCarrierCt, type: 'scatter', mode: 'lines', name: 'avg_carrier_ct' },
  { x: months, y: avgWeatherCt, type: 'scatter', mode: 'lines', name: 'avg_weather_ct' }
];
const layout = {
  title: 'Line Chart with Plotly',
  xaxis: { title: 'Month' },
  yaxis: { title: 'Values' }
};


 Plotly.newPlot('spline', chartData, layout);
 
}

)
  

