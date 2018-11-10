
//getting current day, date and month
var date = new Date();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var day = days[date.getDay()];
var month = "November";
var date_num = date.getDate();
var date_str = `${day}, ${month} ${date_num}`;

//displaying the date into the h4 tag
document.getElementById('date').innerText = date_str;

//gets the username from session to display as greeting
$.get('/getUsername', function (username) {
  $('#greeting_').text("Hi, " + username);
});

//on click of litter link renders map in right outer div
$(document).ready(function () {
  $("#litter").click(function (event) {
    $("#right_outer").html(`
    <iframe src= "/map" style="width:100%; height:100%;"> </iframe>`)
      ;
  });
});
//on click of litter link renders graph in right outer div
$(document).ready(function () {
  $("#home").click(function (event) {
    $("#right_outer").html(`
    <iframe src= "/home" style="width:100%; height:100%;"> </iframe>`)
      ;
  });
});

 // //displaying a map using the iframe tag when user clicks air pollution
// document.getElementById('air').onclick= function () {
//   document.getElementById('right_outer').innerHTML = `
//          <iframe id="map" src= "heatmap_test2.html" style="width:100%; height:100%;" > </iframe>
//       `;
// };

//displaying a map in a html file using the iframe tag when user clicks litter
// document.getElementById('litter').onclick= function () {
//   document.getElementById('right_outer').innerHTML = `
//          <iframe id="map" src= "/map.html" style="width:100%; height:100%;"> </iframe>
//       `;
// };