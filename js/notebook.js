var map;
var minValue;

//Map function that all variables and elements are held.
function createMap(){
    //create the map
    //var data = adaptedAjax();
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

// //added section from previous activity
// //Popup function where city population data will be returned.
// function onEachFeature(feature, layer) {
//
//     var popupContent = "";
//     if (feature.properties) {
//         for (var property in feature.properties){
//
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
//   };

// //Creates circle markers based on location.
// function getData(response){
//     var geojsonMarkerOptions = {
//       radius: 8,
//       fillColor: "#ff7800",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//     };
//
//     console.log('Here')
//
// L.geoJson(response, {
//       pointToLayer: function (feature, latlng){
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//       },
//       onEachFeature: onEachFeature
//
//     }).addTo(map);
//   };
//
// //Ajax function to retrieve the correct data
// // from the data folder, data type json. Without this function,
// // the data from Megacities (map.geojson) wouldn't appear/ be called.
// function adaptedAjax(){
//   var data;
//   $.ajax("data/mediandata.geojson", {
//     dataType: 'json',
//     success: function(response){
//       data = response;
//       getData(data);
//       console.log('Here')
//     }
//   });
//   return data
// }

//Above till here is the lines added

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


//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    //var attribute = "2018";
    var attribute = attributes[0];
  //  console.log(attribute)
    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    geojsonMarkerOptions.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, geojsonMarkerOptions);

    //build popup content string
    var popupContent = createPopupContent(feature.properties, attribute);
    //var popupContent = "<p><b>City:</b> " + feature.properties.State + "</p>";
    //popupContent += "<p><b>Median income in " + attribute + ":</b> " + feature.properties[attribute] + " dollars</p>";


    //var popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";


//    var year = attribute.split(" ")[1];
//    popupContent += "<p><b>Median income in " + year + ":</b> " + feature.properties[attribute] + " dollars</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent,{offset: new L.Point(0,-geojsonMarkerOptions.radius)});

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function createPropSymbols(response,attributes){
  L.geoJson(response, {
          pointToLayer : function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
          }
  }).addTo(map);
};

function getData(map){
    var mydata;
      $.getJSON("data/mediandata.geojson", function(response){

        var attributes = processData(response);

        minValue = calcMinValue(response);

        createPropSymbols(response, attributes);

        SequenceControls = createSequenceControls(attributes);
    //createPropSymbols(response);
  });
};

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

// add our own buttons
      $('#reverse').html('<img src="img/noun_back_37216.png">');
      $('#forward').html('<img src="img/noun_forward_2812173.png">');

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

        updatePropSymbols(attributes[index]);
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
          if (attribute.indexOf("") > -1){
              attributes.push(attribute);
          };
      };
      return attributes;
  };
//
// //Step 3: Add circle arkers for point features to the map
// function createPropSymbols(data){
//   var attribute = '2018';
//
//   var geojsonMarkerOptions = {
//     fillColor: "#ff7800",
//     color: "#fff",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8,
//     radius: 8
//   };
//
//   L.geoJson(data, {
//       pointToLayer: function (feature, latlon) {
//         //return pointToLayer(feature, latlon, attributes);
//         var attValue = Number(feature.properties[attribute]);
//         //geojsonMarkerOptions.radius = calcPropRadius(attValue);
//         //return L.circleMarker(latlng, geojsonMarkerOptions);
//         return L.circleMarker(latlon, geojsonMarkerOptions);
//       }
//     }).addTo(map)
//
// };
//
//
//
// //Step 2: Import GeoJSON data
// function getData(map){
//
//      //load the data
// //     $.getJSON("data/mediandata.geojson", function(response){
//      $.ajax("data/mediandata.geojson", function(response){
//
//           //calculate minimum data value
//           minValue = calcMinValue(response);
//
//           //call function to create proportional symbols
//           createPropSymbols(response);
//      });
// };

// function getData(map){
//   var mydata;
//     $.getJSON("data/mediandata.geojson", function(response){
//
//       var attributes = processData(response);
//
//       minValue = calcMinValue(response);
//
//       createPropSymbols(response, attributes);
//
//       createSequenceControls(attributes);
//     //createPropSymbols(response);
//   });
// };
//
// function createSequenceControls(attributes){
//       console.log('Here sequence')
//       //create range input element (slider)
//       $('#panel').append('<input class="range-slider" type="range">');
//       $('.range-slider').attr({
//         max: 8,
//         min: 0,
//         value: 0,
//         step: 1
//       });
//       $('#panel').append('<button class="step" id="reverse">Reverse</button>');
//       $('#panel').append('<button class="step" id="forward">Forward</button>');
//
//       //$('#reverse').html('<img src="img/noun_back_37216.png">');
//     //  $('#forward').html('<img src="img/noun_forward_2812173.png">');
//
//       //Example 3.14 line 2...Step 5: click listener for buttons
//       $('.step').click(function(){
//     //get the old index value
//         var index = $('.range-slider').val();
//
//     //Step 6: increment or decrement depending on button clicked
//         if ($(this).attr('id') == 'forward'){
//           index++;
//         //Step 7: if past the last attribute, wrap around to first attribute
//           index = index > 7 ? 0 : index;
//         } else if ($(this).attr('id') == 'reverse'){
//           index--;
//         //Step 7: if past the first attribute, wrap around to last attribute
//           index = index < 0 ? 7 : index;
//           console.log('Here sequence 2')
//         };
//
//     //Step 8: update slider
//         $('.range-slider').val(index);
//
//         updatePropSymbols(attributes[index]);
//       });
//
//       $('.range-slider').on('input', function(){
//         var index =$(this).val();
//         updatePropSymbols(attributes[index]);
//       });
//   };

//Above Example 3.10...Step 3: build an attributes array from the data
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

//Called in both step button and slider event listener handlers
//Step 9: pass new attribute to update symbols
//updatePropSymbols(attributes[index]);

//Step 10: Resize proportional symbols according to new attribute values
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
calcMinValue(data)
calcPropRadius(attValue)
onEachFeature(feature, layer)
pointToLayer(feature, latlng, attributes)
createPropSymbols(response,attributes)
getData(map)
createSequenceControls(attributes)
processData(data)
updatePropSymbols(attribute)

$(document).ready(createMap);




//below is the main.js as of March 6, 2020 early AM
// global variables
var map;
var minValue;
var SequenceControls
var Legend;
//Map function that all variables and elements are held.
function createMap(){
    //create the map
    //var data = adaptedAjax();
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
  //  createSequenceControls();

    // calcMinValue(data)
    // calcPropRadius(attValue)
    // onEachFeature(feature, layer)
    // pointToLayer(feature, latlng, attributes)
    // createPropSymbols(response,attributes)
    // getData(map)
    // createSequenceControls(attributes)
    // processData(data)
    // updatePropSymbols(attribute)


};
//Calculate the min value of the proportional symbol
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

function createPopupContent(properties, attribute){
    var popupContent = "<p><b>Median income:</b> " + year + ":</b> " + properties[attribute] + " dollars</p>";

    return popupcontent;
};

function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    //var attribute = "2018";
    var attribute = attributes[0];
  //  console.log(attribute)
    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    geojsonMarkerOptions.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, geojsonMarkerOptions);

    //build popup content string
    var popupContent = createPopupContent(feature.properties, attribute);
    //var popupContent = "<p><b>City:</b> " + feature.properties.State + "</p>";
    //popupContent += "<p><b>Median income in " + attribute + ":</b> " + feature.properties[attribute] + " dollars</p>";


    //var popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";


//    var year = attribute.split(" ")[1];
//    popupContent += "<p><b>Median income in " + year + ":</b> " + feature.properties[attribute] + " dollars</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent,{offset: new L.Point(0,-geojsonMarkerOptions.radius)});

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function createPropSymbols(response,attributes){
  L.geoJson(response, {
          pointToLayer : function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
          }
  }).addTo(map);
};

function getData(map){
    var mydata;
      $.getJSON("data/mediandata.geojson", function(response){

        var attributes = processData(response);

        minValue = calcMinValue(response);

        createPropSymbols(response,attributes);

        SequenceControls = createSequenceControls(attributes);
        Legend = createLegend(attributes);
    //createPropSymbols(response);
  });
};


//HERE
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

// add our own buttons
      $('#reverse').html('<img src="img/noun_back_37216.png">');
      $('#forward').html('<img src="img/noun_forward_2812173.png">');

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

        updatePropSymbols(attributes[index]);
      });

      $('.range-slider').on('input', function(){
        var index =$(this).val();
        updatePropSymbols(attributes[index]);
      });
  };
//HERE


  function processData(data){
      //empty array to hold attributes
      var attributes = [];

      //properties of the first feature in the dataset
      var properties = data.features[0].properties;

      //push each attribute name into attributes array
      for (var attribute in properties){
          //only take attributes with population values
          if (attribute.indexOf("") > -1){
              attributes.push(attribute);
          };
      };
      return attributes;
  };

  //Here we create function to update proportional symbols as we click through the sequence.
    function updatePropSymbols(attribute){
        map.eachLayer(function(layer){
            if (layer.feature && layer.feature.properties[attribute]){
                //update the layer style and popup
                var props = layer.feature.properties;

                //update each feature's radius based on new attribute values
                var radius = calcPropRadius(props[attribute]);
                layer.setRadius(radius);

                //add city to popup content string
                //var popupContent = "<p><b>City:</b> " + props.City + "</p>";
                var popupContent = createPopupCotent(props, attribute);
                popup = layer.getPopup();
                popup.setContent(popupContent).update();

                //add formatted attribute to panel content string
              //  var year = attribute.split("_")[1];
              //  popupContent += "<p><b>Median income in " + year + ":</b> " + props[attribute] + " dollars</p>";

                //update popup content
              //  popup = layer.getPopup();
            //    popup.setContent(popupContent).update();
            };
        });
    };

//Creates circle markers based on location.
// function getData(response){
//     var geojsonMarkerOptions = {
//       radius: 8,
//       fillColor: "#ff7800",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//     };
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
// function adaptedAjax(){
//   var data;
//   $.ajax("data/mediandata.geojson", {
//     dataType: 'json',
//     success: function(response){
//       data = response;
//       getData(data);
//     }
//   });
//   return data
// }
//
//
// //HERE
// //This function creates buttons of forward and backward
// function createSequenceControls(attributes){
//       console.log('Here sequence')
//       //create range input element (slider)
//       $('#panel').append('<input class="range-slider" type="range">');
//       $('.range-slider').attr({
//         max: 8,
//         min: 0,
//         value: 0,
//         step: 1
//       });
//       $('#panel').append('<button class="step" id="reverse">Reverse</button>');
//       $('#panel').append('<button class="step" id="forward">Forward</button>');
//
//       //$('#reverse').html('<img src="img/noun_back_37216.png">');
//     //  $('#forward').html('<img src="img/noun_forward_2812173.png">');
//
//       //Example 3.14 line 2...Step 5: click listener for buttons
//       $('.step').click(function(){
//     //get the old index value
//         var index = $('.range-slider').val();
//
//     //Step 6: increment or decrement depending on button clicked
//         if ($(this).attr('id') == 'forward'){
//           index++;
//         //Step 7: if past the last attribute, wrap around to first attribute
//           index = index > 7 ? 0 : index;
//         } else if ($(this).attr('id') == 'reverse'){
//           index--;
//         //Step 7: if past the first attribute, wrap around to last attribute
//           index = index < 0 ? 7 : index;
//           console.log('Here sequence 2')
//         };
//
//     //Step 8: update slider
//         $('.range-slider').val(index);
//
//
//         //updatePropSymbols(attributes[index]);
//
//         updatePropSymbols([index]);
//
//       });
//
//       $('.range-slider').on('input', function(){
//         var index =$(this).val();
//         updatePropSymbols(attributes[index]);
//       });
//   };
// //HERE

//   function processData(data){
//       //empty array to hold attributes
//       var attributes = [];
//
//       //properties of the first feature in the dataset
//       var properties = data.features[0].properties;
//
//       //push each attribute name into attributes array
//       for (var attribute in properties){
//           //only take attributes with population values
//           if (attribute.indexOf("") > -1){
//               attributes.push(attribute);
//           };
//       };
//       return attributes;
//   };
//
// //Here we create function to update proportional symbols as we click through the sequence.
//   function updatePropSymbols(attribute){
//       map.eachLayer(function(layer){
//           if (layer.feature && layer.feature.properties[attribute]){
//               //update the layer style and popup
//               var props = layer.feature.properties;
//
//               //update each feature's radius based on new attribute values
//               var radius = calcPropRadius(props[attribute]);
//               layer.setRadius(radius);
//
//               //add city to popup content string
//               //var popupContent = "<p><b>City:</b> " + props.City + "</p>";
//               var popupContent = createPopupCotent(props, attribute);
//               popup = layer.getPopup();
//               popup.setContent(popupContent).update();
//
//               //add formatted attribute to panel content string
//             //  var year = attribute.split("_")[1];
//             //  popupContent += "<p><b>Median income in " + year + ":</b> " + props[attribute] + " dollars</p>";
//
//               //update popup content
//             //  popup = layer.getPopup();
//           //    popup.setContent(popupContent).update();
//           };
//       });
//   };


function createSequenceControls(attributes){
      var SequenceControl = L.Control.extend({
          options: {
              position: 'bottomleft'
          },

  				onAdd: function () {
              // create the control container div with a particular class name
              var container = L.DomUtil.create('div', 'sequence-control-container');

              //create range input element (slider)
              $(container).append('<input class="range-slider" type="range">');

  						//$(container).append('<button class="step" id="reverse" title="Reverse"><img src="img/noun_Reverse.png"></button>');
  						//$(container).append('<button class="step" id="forward" title="Forward"><img src="img/noun_Play.png"></button>');
              $(container).append('<button class="step" id="reverse">Reverse</button>');
              $(container).append('<button class="step" id="forward">Forward</button>');

              return container;
          }
      });

  		map.addControl(new SequenceControl());

  		// add listeners after adding control

  		$('.range-slider').attr({
  				max: 8,
  				min: 0,
  				value: 0,
  				step: 1
  		});

  		//Step 5: click listener for buttons
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
  			};

  			//Step 8: update slider
  			$('.range-slider').val(index);

  			//Called in both step button and slider event listener handlers
  			//Step 9: pass new attribute to update symbols
  			updatePropSymbols(attributes[index]);

  		});

  	//Step 5: input listener for slider
  	$('.range-slider').on('input', function(){
  		//Step 6: get the new index value
  		var index = $(this).val();
  		console.log(index);

  		//Called in both step button and slider event listener handlers
  		//Step 9: pass new attribute to update symbols
  		updatePropSymbols(attributes[index]);

  	});

  }

function createLegend(attributes){
      var LegendControl = L.Control.extend({
          options: {
              position: 'bottomright'
          },

          onAdd: function () {
              // create the control container with a particular class name
              var container = L.DomUtil.create('div', 'legend-control-container');

              //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
  						$(container).append('<div id="legend">'+ 'Median income '+ attributes[0].split("op")[1] +'</div>');

              return container;
          }
      });

      map.addControl(new LegendControl());
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
