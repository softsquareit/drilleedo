





const LeafletMaps = function () {







    const _leafletMapBasic = function () {
        if (typeof leaflet == 'undefined') {
            console.warn('Warning - leaflet.min.js is not loaded.');
            return;
        }






        let config = {
            minZoom: 7,
            maxZoom: 18
        };


        const zoom = 15;


        const lat = 52.37;
        const lng = 4.9041;


        const map = L.map("leaflet_basic", config).setView([lat, lng], zoom);



        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            className: 'map-leaflet'
        }).addTo(map);
    };


    const _leafletMapCluster = function () {
        if (typeof leaflet == 'undefined') {
            console.warn('Warning - leaflet.min.js is not loaded.');
            return;
        }






        let config = {
            minZoom: 6,
            maxZoom: 18
        };


        const zoom = 13;


        const lat = -37.82;
        const lng = 175.24;


        const map = L.map("leaflet_cluster", config).setView([lat, lng], zoom);



        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            className: 'map-leaflet'
        }).addTo(map);



        let markers = L.markerClusterGroup();


        for (var i = 0; i < addressPoints.length; i++) {
            var a = addressPoints[i];
            var title = a[2];
            var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
            marker.bindPopup(title);
            markers.addLayer(marker);
        }


        map.addLayer(markers);
    };


    const _leafletMapGeoJson = function () {
        if (typeof leaflet == 'undefined') {
            console.warn('Warning - leaflet.min.js is not loaded.');
            return;
        }






        let config = {
            minZoom: 6,
            maxZoom: 19
        };


        const zoom = 13;


        const lat = 39.74739;
        const lng = -105;


        const map = L.map("leaflet_geojson", config).setView([lat, lng], zoom);



        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            className: 'map-leaflet'
        }).addTo(map);


        function onEachFeature(feature, layer) {
            let popupContent = '<p>I started out as a GeoJSON ' + feature.geometry.type + ', but now I\'m a Leaflet vector!</p>';

            if (feature.properties && feature.properties.popupContent) {
                popupContent += feature.properties.popupContent;
            }

            layer.bindPopup(popupContent);
        }


        const bicycleRentalLayer = L.geoJSON([bicycleRental, campus], {
            style: function (feature) {
                return feature.properties && feature.properties.style;
            },
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: '#ff7800',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);


        const freeBusLayer = L.geoJSON(freeBus, {
            filter: function (feature, layer) {
                if (feature.properties) {

                    return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
                }
                return false;
            },
            onEachFeature: onEachFeature
        }).addTo(map);


        const coorsLayer = L.geoJSON(coorsField, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    };


    const _leafletMapGroupsControls = function () {
        if (typeof leaflet == 'undefined') {
            console.warn('Warning - leaflet.min.js is not loaded.');
            return;
        }






        const cities = L.layerGroup();


        const mLittleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities);
        const mDenver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities);
        const mAurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities);
        const mGolden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


        const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
        const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=';


        const streets = L.tileLayer(mbUrl, {
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            attribution: mbAttr
        });


        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            className: 'map-leaflet'
        });


        const map = L.map('leaflet_groups_controls', {
            center: [39.73, -104.99],
            zoom: 10,
            layers: [osm, cities]
        });


        const baseLayers = {
            'OpenStreetMap': osm,
            'Streets': streets
        };


        const overlays = {
            'Cities': cities
        };


        const layerControl = L.control.layers(baseLayers, overlays).addTo(map);
        const crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.');
        const rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');


        const parks = L.layerGroup([crownHill, rubyHill]);
        const satellite = L.tileLayer(mbUrl, {
            id: 'mapbox/satellite-v9',
            tileSize: 512,
            zoomOffset: -1,
            attribution: mbAttr,
            className: 'map-leaflet'
        });
        layerControl.addBaseLayer(satellite, 'Satellite');
        layerControl.addOverlay(parks, 'Parks');
    };






    return {
        init: function () {
            _leafletMapBasic();
            _leafletMapCluster();
            _leafletMapGeoJson();
            _leafletMapGroupsControls();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function () {
    LeafletMaps.init();
});
