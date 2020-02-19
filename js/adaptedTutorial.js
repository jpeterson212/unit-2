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
    var popupContent = 'type":"Point","coordinates":[139.75391,35.695126]}},{"type":"Feature","properties":{"City":"Delhi","Pop_1985":7.33,"Pop_1990":9.73,"Pop_1995":12.41,"Pop_2000":15.73,"Pop_2005":18.67,"Pop_2010":21.94,"Pop_2015":25.7},"geometry":{"type":"Point","coordinates":[81.334404,24.734319]}},{"type":"Feature","properties":{"City":"Shanghai","Pop_1985":6.85,"Pop_1990":7.82,"Pop_1995":10.45,"Pop_2000":13.96,"Pop_2005":16.76,"Pop_2010":19.98,"Pop_2015":23.74},"geometry":{"type":"Point","coordinates":[121.483385,31.246027]}},{"type":"Feature","properties":{"City":"São Paulo","Pop_1985":13.39,"Pop_1990":14.78,"Pop_1995":15.91,"Pop_2000":17.01,"Pop_2005":18.29,"Pop_2010":19.66,"Pop_2015":21.07},"geometry":{"type":"Point","coordinates":[-52.984092,-26.084617]}},{"type":"Feature","properties":{"City":"Mumbai (Bombay)","Pop_1985":10.39,"Pop_1990":12.44,"Pop_1995":14.31,"Pop_2000":16.37,"Pop_2005":17.89,"Pop_2010":19.42,"Pop_2015":21.04},"geometry":{"type":"Point","coordinates":[73.032263,19.021521]}},{"type":"Feature","properties":{"City":"Ciudad de México (Mexico City)","Pop_1985":14.28,"Pop_1990":15.64,"Pop_1995":17.02,"Pop_2000":18.46,"Pop_2005":19.28,"Pop_2010":20.13,"Pop_2015":21},"geometry":{"type":"Point","coordinates":[-99.150344,19.371422]}},{"type":"Feature","properties":{"City":"Beijing","Pop_1985":6.02,"Pop_1990":6.79,"Pop_1995":8.31,"Pop_2000":10.16,"Pop_2005":12.81,"Pop_2010":16.19,"Pop_2015":20.38},"geometry":{"type":"Point","coordinates":[116.417592,39.937967]}},{"type":"Feature","properties":{"City":"Kinki M.M.A. (Osaka)","Pop_1985":17.58,"Pop_1990":18.39,"Pop_1995":18.94,"Pop_2000":18.66,"Pop_2005":18.76,"Pop_2010":19.49,"Pop_2015":20.24},"geometry":{"type":"Point","coordinates":[135.501902,34.671654]}},{"type":"Feature","properties":{"City":"Al-Qahirah (Cairo)","Pop_1985":8.33,"Pop_1990":9.89,"Pop_1995":11.96,"Pop_2000":13.63,"Pop_2005":15.17,"Pop_2010":16.9,"Pop_2015":18.77},"geometry":{"type":"Point","coordinates":[31.24967,30.06263]}},{"type":"Feature","properties":{"City":"New York-Newark","Pop_1985":15.83,"Pop_1990":16.09,"Pop_1995":16.94,"Pop_2000":17.81,"Pop_2005":18.09,"Pop_2010":18.37,"Pop_2015":18.59},"geometry":{"type":"Point","coordinates":[-73.9708,40.68295]}},{"type":"Feature","properties":{"City":"Dhaka","Pop_1985":4.66,"Pop_1990":6.62,"Pop_1995":8.33,"Pop_2000":10.28,"Pop_2005":12.33,"Pop_2010":14.73,"Pop_2015":17.6},"geometry":{"type":"Point","coordinates":[90.40744,23.7104]}},{"type":"Feature","properties":{"City":"Karachi","Pop_1985":6.03,"Pop_1990":7.15,"Pop_1995":8.47,"Pop_2000":10.03,"Pop_2005":11.89,"Pop_2010":14.08,"Pop_2015":16.62},"geometry":{"type":"Point","coordinates":[67.01523,24.865645]}},{"type":"Feature","properties":{"City":"Buenos Aires","Pop_1985":9.96,"Pop_1990":10.51,"Pop_1995":11.39,"Pop_2000":12.41,"Pop_2005":13.33,"Pop_2010":14.25,"Pop_2015":15.18},"geometry":{"type":"Point","coordinates":[-58.454595,-34.607357]}},{"type":"Feature","properties":{"City":"Kolkata (Calcutta)","Pop_1985":9.95,"Pop_1990":10.89,"Pop_1995":11.92,"Pop_2000":13.06,"Pop_2005":13.7,"Pop_2010":14.28,"Pop_2015":14.86},"geometry":{"type":"Point","coordinates":[88.362561,22.550437]}},{"type":"Feature","properties":{"City":"Istanbul","Pop_1985":5.41,"Pop_1990":6.55,"Pop_1995":7.67,"Pop_2000":8.74,"Pop_2005":10.51,"Pop_2010":12.7,"Pop_2015":14.16},"geometry":{"type":"Point","coordinates":[28.94966,41.01384]}}]}';

    if (feature.properties) {
                //loop to add feature property names and values to html string
        for (var property in feature.properties){


            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
  }

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
