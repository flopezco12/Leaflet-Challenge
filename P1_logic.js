const api_key = "pk.eyJ1IjoiZmVybG9wbzAyNzUiLCJhIjoiY2xwcmVlZ3V6MDZkeDJpcDl2M2s2eHo4ciJ9.NcvA-yzfEdGa7DeWCVKY1g"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {
console.log(data);
createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 2000;
};

function chooseColor(depth){
if (depth < 10) return "green";
else if (depth < 30) return "greenyellow";
else if (depth < 50) return "yellow";
else if (depth < 70) return "orange";
else if (depth < 90) return "orangered";
else return "red";
}

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
}

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
    var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5
    }
    return L.circle(latlng,markers);
    }
});

createMap(earthquakes);
}

function createMap(earthquakes) {
var mapping = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style:    'mapbox/light-v11',
    access_token: api_key
});

var myMap = L.map("map", {
    center: [38.15, 65.42],
    zoom: 10,
    layers: [mapping, earthquakes]
});

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap)
};