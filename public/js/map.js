
//setting custom icon
var icons = {
    bins: {
        icon: '/img/trash.png'
    }
};

// displays a map initialized to AUS coordinates
// when the user clicks the marker, an info window opens.
function initMap() {
    var aus = { lat: 25.3121, lng: 55.4927 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: aus
    });
    //getting JSON result for /getpins route
    $.getJSON("http://localhost:3000/getpins", function (result) {
        $.each(result, function (i, field) {

            //storing all the values into variables
            var name = field.name;
            var address = field.address;
            var lat = field.lat;
            var lon = field.lng;
            var count = field.count;
            var time= field.time;

            //console.log(field.lat);
            var point = { lat: lat, lng: lon };  //point to plot on map
            //console.log(field);
            var marker = new google.maps.Marker({ position: point, map: map }); //plotting point
            //info window content
            var contentString = '<div id="content">' +
                `<h2 id="firstHeading" class="firstHeading"> Address: ${address} </h2>` +
                '<div id="bodyContent">' +
                `<p> <h3> Latitude: ${lat} <br> ` +
                `Longitude: ${lon} <br>` +
                `Count: ${count} </h3> </p>` +
                `Pin set by: ${name} <br>` +
                `Time: ${time}  <br> ` 
                '</div> </div>';

            //initializing info window
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            //info window pops up on mouseover
            marker.addListener('mouseover', function () {
                infowindow.open(map, marker);
            });

            //info window close on mouseout
            marker.addListener('mouseout', function () {
                infowindow.close();
            });

        });
    });

    //getting json result for getbins route
    $.getJSON("http://localhost:3000/getbins", function (result) {
        $.each(result, function (i, field) {
            //storing all the values into variables
            var binid = field.id;
            var temp = field.temperature;
            var gas = field.gas;
            var clear = field.clear;
            var time = field.time;
            //checking condition of bin
            if (clear == 0) {
                clear = "Clean bin";
            }
            else {
                clear = "Full bin";
            }

            var lat = field.lat;
            var lon = field.lng;
            var msg = "";
            //temp greater than 40 - alert for possibility of fire
            if (temp > 40) {
                msg = msg + "Fire alert";
            }
            //methane gas concentration greater than 1000ppm 
            if (gas > 1000) {
                msg = msg + ", Foul odor";
            }
            //normal condition of bin- no foul odor or fire
            if (msg == "") {
                msg = msg + "Normal";
            }
            //info window content
            var contentString = '<div id="content">' +
                `<h2 id="firstHeading" class="firstHeading"> Bin ${binid} - ${msg}, ${clear} </h2>` +
                '<div id="bodyContent">' +
                `<p>  Latitude: ${lat} <br> ` +
                `Longitude: ${lon} <br>` +
                `Temperature: ${temp} °C <br>` +
                `Gas: ${gas} ppm <br>` +
                `Condition: ${clear} <br>` +
                `Time: ${time}  <br> </p>` 
                '</div> </div>';

            var point = { lat: lat, lng: lon }; //point to plot on map
            //plotting point on map
            var marker = new google.maps.Marker({ position: point, map: map, icon: icons.bins.icon });
            console.log(marker);
            //initializing info window
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            //info window pops up on mouseover
            marker.addListener('mouseover', function () {
                infowindow.open(map, marker);
            });
            //info window pops up on mouseout
            marker.addListener('mouseout', function () {
                infowindow.close();
            });
        });
    });


}
//loading map calling initMap function
google.maps.event.addDomListener(window, "load", initMap);