//Create global map variable.
var map;

//Map function that all variables and elements are held.
function createMap(){
    //create the map
    map = L.map('mapid', {
        center: [45, -100],
        zoom: 3
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoicGV0ZXJzb24yIiwiYSI6ImNrNmpza3ZwNDAweXEzZXF0bGxmb2g5eTQifQ.10E8d50dRzp7rkDlUiEj_g'
    }).addTo(map);

    getData();
};

function onEachFeature(feature, layer) {
  console.log('Start of onEachFeature')
    var popupContent = "";
    console.log('Here1')
    if (layer.properties) {
        for (var property in layer.properties){
            console.log('Here')
            popupContent += "<p>" + property + ": " + layer.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
  }

//function to retrieve the data and place it on the map
function getData(map){
  console.log('data!')
    //load the data
    $.ajax("data/income.geojson", function(response){

            //create a Leaflet GeoJSON layer and add it to the map
L.geoJson(response, {
    onEachFeature: onEachFeature
}).addTo(map);
    });
};

function getData(){
  console.log('data')
  $.getJSON("data/income.geojson", function(response){
    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    L.geoJson(response, {
      pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map);
  });
};


$(document).ready(createMap);


//https://www.infoplease.com/business-finance/poverty-and-income/capita-personal-income-state
