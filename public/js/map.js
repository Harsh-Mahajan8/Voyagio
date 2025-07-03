var map = L.map('map').setView(coordinates, 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker(coordinates).addTo(map);

marker.bindPopup(`<b>${name} </b>`).openPopup();
