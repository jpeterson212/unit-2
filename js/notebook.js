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

    getData();
    createSequenceControls();

    // calcMinValue(data)
    // calcPropRadius(attValue)
    // onEachFeature(feature, layer)
    // pointToLayer(feature, latlng, attributes)
    // createPropSymbols(response,attributes)
    // getData(map)
    // createSequenceControls(attributes)
     processData(data)
    // updatePropSymbols(attribute)


};

function calcMinValue(data){
    var allValues = [];

    for(var state of data.features){

          for (var year = 2012; year <= 2018; year+=1){

              var value = state.properties["State"+ String(year)];

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
  $.ajax("data/mediandata.geojson", {
    dataType: 'json',
    success: function(response){
      data = response;
      getData(data);
    }
  });
  return data
}

function createSequenceControls(attributes){
      console.log('Here sequence')
      //create range input element (slider)
      $('#panel').append('<input class="range-slider" type="range">');
      $('.range-slider').attr({
        max: 8,
        min: 0,
        value: 0,
        step: 1
      });
      $('#panel').append('<button class="step" id="reverse">Reverse</button>');
      $('#panel').append('<button class="step" id="forward">Forward</button>');

      //$('#reverse').html('<img src="img/noun_back_37216.png">');
    //  $('#forward').html('<img src="img/noun_forward_2812173.png">');

      //Example 3.14 line 2...Step 5: click listener for buttons
      $('.step').click(function(){
    //get the old index value
        var index = $('.range-slider').val();

    //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
          index++;
        //Step 7: if past the last attribute, wrap around to first attribute
          index = index > 7 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
          index--;
        //Step 7: if past the first attribute, wrap around to last attribute
          index = index < 0 ? 7 : index;
          console.log('Here sequence 2')
        };

    //Step 8: update slider
        $('.range-slider').val(index);


        //updatePropSymbols(attributes[index]);

        updatePropSymbols([index]);

      });

      $('.range-slider').on('input', function(){
        var index =$(this).val();
        updatePropSymbols(attributes[index]);
      });
  };

  function processData(data){
      //empty array to hold attributes
      var attributes = [];

      //properties of the first feature in the dataset
      var properties = data.features[0].properties;

      //push each attribute name into attributes array
      for (var attribute in properties){
          //only take attributes with population values
          if (attribute.indexOf("Pop") > -1){
              attributes.push(attribute);
          };
      };
      return attributes;
  };


  function updatePropSymbols(attribute){
      map.eachLayer(function(layer){
          if (layer.feature && layer.feature.properties[attribute]){
              //update the layer style and popup
              var props = layer.feature.properties;

              //update each feature's radius based on new attribute values
              var radius = calcPropRadius(props[attribute]);
              layer.setRadius(radius);

              //add city to popup content string
              var popupContent = "<p><b>City:</b> " + props.City + "</p>";

              //add formatted attribute to panel content string
              var year = attribute.split("_")[1];
              popupContent += "<p><b>Median income in " + year + ":</b> " + props[attribute] + " dollars</p>";

              //update popup content
              popup = layer.getPopup();
              popup.setContent(popupContent).update();
          };
      });
  };

  // calcMinValue(data)
  // calcPropRadius(attValue)
  // onEachFeature(feature, layer)
  // pointToLayer(feature, latlng, attributes)
  // createPropSymbols(response,attributes)
  // getData(map)
  // createSequenceControls(attributes)
  // processData(data)
  // updatePropSymbols(attribute)


$(document).ready(createMap);
