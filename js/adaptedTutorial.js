var map;

function createMap(){
    //create the map
    map = L.map('mapid', {
        center: [20, 0],
        zoom: 2
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoicGV0ZXJzb24yIiwiYSI6ImNrNmpza3ZwNDAweXEzZXF0bGxmb2g5eTQifQ.10E8d50dRzp7rkDlUiEj_g'
    }).addTo(map);

    getData();
};

//added at Example 2.3 line 20...function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var cities = "Cities, Pop_1985, Pop_1990, Pop_1995, Pop_2000, Pop_2005, Pop_2010, Pop_2015"
      if (feature.properties) {
        
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            cities += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(cities);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.getJSON("data/map.geojson", function(response){

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature
            }).addTo(map);
    });
};

function getData(){
  $.getJSON("data/map.geojson", function(response){
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
