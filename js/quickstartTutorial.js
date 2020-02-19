//Setting map parameters (the view)
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoicGV0ZXJzb24yIiwiYSI6ImNrNmpza3ZwNDAweXEzZXF0bGxmb2g5eTQifQ.10E8d50dRzp7rkDlUiEj_g'
}).addTo(mymap);

//Creates a marker on the map.
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//Creates a red circle
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//Creates a polygon.
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

//Message will appear on clicking the marker.
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

//Message will appear when you click on the circle.
circle.bindPopup("I am a circle.");

//Message will appear when click on the polygon.
polygon.bindPopup("I am a polygon.");

//This appears right when you open the page. The popup says
// 'I am a standaone popup'
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

    function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);

var popup = L.popup();

//This makes a popup message appear with the lat and lon of the
// location you clicked.
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);
