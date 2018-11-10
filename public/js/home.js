var x = []; //array for x axis values
var y = []; //array for y axis values

//getting getpins routes for db values
$.getJSON("http://localhost:3000/getpins", function (result) {
  $.each(result, function (i, field) {
    var time = field.time;                //storing time variable from db
    var count = Number(field.count);      //storing count variable from db
    //console.log(count);
    //appending x and y values to the array
    x.push(`${time}`);                    
    y.push(count);
  });
});

//var trace1 = { x: x, y: y, type: 'scatter' };  //scatter plot
//var data = [trace1];
console.log(data);
//layout of the plot
var layout = {
  xaxis: {
    title: 'Time',
    type: 'date'
  },
  yaxis: {
    title: 'Pins placed'
  },
  title: 'Litter Pins Activity'
};

var data =[{
  x: ["2017-06-23T23:54:10-07:00", "2017-06-23T23:54:20-07:00", "2017-06-23T23:54:30-07:00", "2017-06-23T23:54:40-07:00", "2017-06-23T23:54:50-07:00"],
  y: [1, 1, 2, 1, 1],
  type: 'scatter'
}];

//initializing a new plot with data and layout
Plotly.newPlot('graph', data, layout);

