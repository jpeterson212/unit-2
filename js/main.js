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
    var popupContent =
    {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"1980":"8,105","1990":"15,304","1995":"19,630","2000":"23,727","2003":"25,911","2006":"29,920","2009":"31,632","2012":"33,749","2015":"37,509","State":"Idaho"},"geometry":{"type":"Point","coordinates":[-114.964267,43.764877]}},{"type":"Feature","properties":{"1980":"10,454","1990":"20,159","1995":"25,643","2000":"31,856","2003":"33,690","2006":"38,409","2009":"41,411","2012":"44,815","2015":"49,471","State":"Illinois"},"geometry":{"type":"Point","coordinates":[-89.191575,40.265028]}},{"type":"Feature","properties":{"1980":"8,914","1990":"16,815","1995":"21,845","2000":"26,933","2003":"28,783","2006":"32,288","2009":"33,725","2012":"36,902","2015":"40,998","State":"Indiana"},"geometry":{"type":"Point","coordinates":[-86.250281,39.904493]}},{"type":"Feature","properties":{"1980":"9,226","1990":"16,683","1995":"21,181","2000":"26,431","2003":"29,043","2006":"33,038","2009":"36,751","2012":"42,126","2015":"44,971","State":"Iowa"},"geometry":{"type":"Point","coordinates":[-93.500069,42.039943]}},{"type":"Feature","properties":{"1980":"9,880","1990":"17,639","1995":"21,889","2000":"27,374","2003":"29,935","2006":"34,799","2009":"37,916","2012":"41,835","2015":"45,876","State":"Kansas"},"geometry":{"type":"Point","coordinates":[-98.380429,38.500327]}},{"type":"Feature","properties":{"1980":"7,679","1990":"14,751","1995":"19,215","2000":"24,085","2003":"26,252","2006":"29,729","2009":"31,883","2012":"35,041","2015":"38,989","State":"Kentucky"},"geometry":{"type":"Point","coordinates":[-84.924095,37.696825]}},{"type":"Feature","properties":{"1980":"8,412","1990":"14,279","1995":"19,541","2000":"23,090","2003":"26,100","2006":"31,821","2009":"35,507","2012":"39,413","2015":"43,252","State":"Louisiana"},"geometry":{"type":"Point","coordinates":[-92.51441,30.542601]}},{"type":"Feature","properties":{"1980":"7,760","1990":"17,041","1995":"20,240","2000":"25,380","2003":"28,831","2006":"32,095","2009":"36,745","2012":"39,481","2015":"42,077","State":"Maine"},"geometry":{"type":"Point","coordinates":[-69.171071,45.243327]}},{"type":"Feature","properties":{"1980":"10,394","1990":"22,088","1995":"26,896","2000":"33,482","2003":"37,331","2006":"43,788","2009":"48,285","2012":"51,971","2015":"56,127","State":"Maryland"},"geometry":{"type":"Point","coordinates":[-76.346717,39.038828]}},{"type":"Feature","properties":{"1980":"10,103","1990":"22,248","1995":"28,051","2000":"37,704","2003":"39,815","2006":"46,299","2009":"49,875","2012":"54,687","2015":"61,032","State":"Massachusetts"},"geometry":{"type":"Point","coordinates":[-71.531484,42.358752]}},{"type":"Feature","properties":{"1980":"9,801","1990":"18,239","1995":"23,975","2000":"29,127","2003":"30,439","2006":"33,788","2009":"34,025","2012":"37,497","2015":"42,427","State":"Michigan"},"geometry":{"type":"Point","coordinates":[-84.633107,43.924812]}},{"type":"Feature","properties":{"1980":"9,673","1990":"18,784","1995":"24,583","2000":"31,935","2003":"34,443","2006":"38,859","2009":"41,552","2012":"46,227","2015":"50,541","State":"Minnesota"},"geometry":{"type":"Point","coordinates":[-94.579641,46.63636]}},{"type":"Feature","properties":{"1980":"6,573","1990":"12,578","1995":"17,185","2000":"20,900","2003":"23,448","2006":"27,028","2009":"30,103","2012":"33,073","2015":"35,444","State":"Mississippi"},"geometry":{"type":"Point","coordinates":[-89.687118,32.921921]}},{"type":"Feature","properties":{"1980":"8,812","1990":"17,407","1995":"22,094","2000":"27,206","2003":"29,252","2006":"32,789","2009":"35,676","2012":"39,049","2015":"42,752","State":"Missouri"},"geometry":{"type":"Point","coordinates":[-92.747022,38.353141]}},{"type":"Feature","properties":{"1980":"8,895","1990":"17,379","1995":"22,196","2000":"27,630","2003":"30,758","2006":"34,440","2009":"38,081","2012":"43,143","2015":"48,000","State":"Nebraska"},"geometry":{"type":"Point","coordinates":[-99.810075,41.499671]}}]}

    if (feature.properties) {
        for (var property in feature.properties){
          
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
  }

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.getJSON("data/income.geojson", function(response){

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
                onEachFeature: onEachFeature
            }).addTo(map);
    });
};

function getData(){
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
