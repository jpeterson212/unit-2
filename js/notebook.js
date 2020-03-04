//Based off adaptedTutorial, income data added.
//Create global map variable.
var map;
var minValue;
//Map function that all variables and elements are held.
function createMap(){
    //create the map
    var data = adaptedAjax();
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

    getData(map);
};


//Popup function where city population data will be returned.
function onEachFeature(feature, layer) {

    var popupContent = "";
    if (feature.properties) {
        for (var property in feature.properties){

            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
  };

// //Creates circle markers based on location.
// //function getData(response){
// function createPropSymbols(data){
//     var geojsonMarkerOptions = {
//       radius: 8,
//       fillColor: "#ff7800",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//     };
//
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//       pointToLayer: function (feature, latlng) {
//           return L.circleMarker(latlng, geojsonMarkerOptions);
//       }
//     }).addTo(map);
// };
//Step 2: Import GeoJSON data
function getData(){
    //load the data
    $.getJSON("data/mediandata.geojson", function(response){
            //call function to create proportional symbols
            createPropSymbols(response);
    });
};


function calcMinValue(data){
  var allValues = [];
  for(var state of data.features){
    for (var year = 2012; year <= 2018; year+=1){
      var value = state.properties["pop"+ String(year)];
      allValues.push(value);
    }
  }
  //get minium values of our array
  var minValue = Math.min(...allValues)
  return minValue;
}

//calculate the radius of earch proportional symbol
function calcPropRadius(attValue) {
  //constant factor adjust symbol sizes evenly
  var minRadius = 5;
  //Flannery Appearance Compensation formula
  var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
  return radius;
};

//Step 3: Add circle arkers for point features to the map
function createPropSymbols(data){
  var attribute = '2018';

  var geojsonMarkerOptions = {
    fillColor: "#ff7800",
    color: "#fff",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    radius: 8
  };

  L.geoJson(data, {
      pointToLayer: function (feature, latlon) {
        //return pointToLayer(feature, latlon, attributes);
        var attValue = Number(feature.properties[attribute]);
        //geojsonMarkerOptions.radius = calcPropRadius(attValue);
        //return L.circleMarker(latlng, geojsonMarkerOptions);
        return L.circleMarker(latlon, geojsonMarkerOptions);
      }
    }).addTo(map)

};

//
// L.geoJson(response, {
//       pointToLayer: function (feature, latlng){
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//       },
//       onEachFeature: onEachFeature
//
//     }).addTo(map);
//   };

//Ajax function to retrieve the correct data
// from the data folder, data type json. Without this function,
// the data from Megacities (map.geojson) wouldn't appear/ be called.
function adaptedAjax(){
  var data;
  $.ajax("data/mediandata.geojson", {
    dataType: 'json',
    success: function(response){
      data = response;
      getData(data);
    }
  });
  return data
}

//Calling the first function to add all
// elements to the map.
$(document).ready(createMap);
