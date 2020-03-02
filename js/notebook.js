//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//Step 1. Create the Leaflet map--already done in createMap()
//Step 2. Import GeoJSON data--already done in getData()
//Step 3. Add circle markers for point features to the map--already done in AJAX callback
//Step 4. Determine the attribute for scaling the proportional symbols
//Step 5. For each feature, determine its value for the selected attribute
//Step 6. Give each feature's circle marker a radius based on its attribute value

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
  var radius = 1.0083 * Math.pow(att/Value/minValue,0.5715) * minRadius
    return radius;
};

//Step 3: Add circle arkers for point features to the map
function createPropSymbols(data){

//Step 4: Determine which attribute to visualize with proportional symbols
  var attribute = "2018";

  //create marker options
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  L.geoJson(data, {
    pointToLayer: function (feature, latlon) {
      //return L.circleMarker(latlng, geojsonMarkerOptions);
    var attValue = Number(feature.properties[attribute]);
    geojsonMarkerOptions.radius = calcPropRadius(attValue);
    return L.circileMarker(latlng, geojsonMarkerOptions);
    }
  }).addTo(map)
};

function getData(){
  $.getJSON("data/mediandata.geojson", function(response){
    minValue = calcMinValue(response);
    createPropSymobols(response);
    //createPropSymbols(response);
  });
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

  //function to convert markers to circle markers
function pointToLayer(feature, latlng){
      //Determine which attribute to visualize with proportional symbols
      var attribute = "2018";

      //create marker options
      var options = {
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      };

      //For each feature, determine its value for the selected attribute
      var attValue = Number(feature.properties[attribute]);

      //Give each feature's circle marker a radius based on its attribute value
      geojsonMarkerOptions.radius = calcPropRadius(attValue);

      //create circle marker layer
      var layer = L.circleMarker(latlng, geojsonMarkerOptions);

      //build popup content string
      var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";
      var year = attribute.split("_")[1];
      popupContent += "<p><b>Median income in " + year + ":</b> " + feature.properties[attribute] + " dollars</p>";

      //bind the popup to the circle marker
      layer.bindPopup(popupContent);

      //return the circle marker to the L.geoJson pointToLayer option
      return layer;
  };

  //Add circle markers for point features to the map
function createPropSymbols(data, map){
      //create a Leaflet GeoJSON layer and add it to the map
      L.geoJson(data, {
          pointToLayer: pointToLayer
      }).addTo(map);
  };



//Retrieves data from data folder
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

$(document).ready(createMap);
