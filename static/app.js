d3.json("http://127.0.0.1:5000/").then( (data) => {
let x = [];
let y = [];
for(let i =0; i < data.length; i++) {
    x.push(data[i].arr_delay)
    y.push(data[i].carrier_delay)
}
console.log(x)
console.log(y)
 let trace1 = {
    x: x.slice(0,10),
    y : y.slice(0,10),
    type: "bar"
 }
 let tracebar = [trace1]; 
 Plotly.newPlot("bar", tracebar)

}

)