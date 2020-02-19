//Create global map variable.
var map;

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

    getData();
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

//Creates circle markers based on location.
function getData(response){
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
      },
      onEachFeature: onEachFeature

    }).addTo(map);
  };

//Ajax function to retrieve the correct data
// from the data folder, data type json. Without this function,
// the data from Megacities (map.geojson) wouldn't appear/ be called.
function adaptedAjax(){
  var data;
  $.ajax("data/income.geojson", {
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



//
// function onEachFeature(feature, layer) {
//     var popupContent = "";
//     if (feature.properties) {
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//           layer.bindPopup(popupContent);
//     };
//   };
//
// // //function to retrieve the data and place it on the map
// // function getData(map){
// //     $.ajax("data/income.geojson", function(response){
// //
// //             //create a Leaflet GeoJSON layer and add it to the map
// // L.geoJson(response, {
// //     onEachFeature: onEachFeature
// // }).addTo(map);
// //     });
// // };
//
// function getData(){
//   //$.getJSON("data/income.geojson", function(response){
//     var geojsonMarkerOptions = {
//       radius: 8,
//       fillColor: "#ff7800",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//     };
//     L.geoJson(response, {
//       pointToLayer: function (feature, latlng){
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//       }
//     }).addTo(map);
//   };
// //Ajax function to retrieve the correct data
// // from the data folder, data type json. Without this function,
// // the data from Megacities (map.geojson) wouldn't appear/ be called.
// function adaptedAjax(){
//     var data;
//     $.ajax("data/map.geojson", {
//       dataType: 'json',
//       success: function(response){
//         data = response;
//         getData(data);
//       }
//     });
//     return data
// };


//$(document).ready(createMap);


//https://www.infoplease.com/business-finance/poverty-and-income/capita-personal-income-state
