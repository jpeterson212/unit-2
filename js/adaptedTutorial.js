//adaptedTutorial

/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData();
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    $.getJSON("data/MegaCities.geojson", function(response){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response).addTo(map);
        });
};

$(document).ready(createMap);

// Above is copied from lab notes
