// Initialize the map
var map = L.map('map').setView([20.5937, 78.9629], 5); // Default center (India)

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Object to hold bus markers by driver ID
var busMarkers = {};

// Function to update or add bus location
function updateBusLocation(driverId, latitude, longitude) {
    if (busMarkers[driverId]) {
        // Update existing marker position
        busMarkers[driverId].setLatLng([latitude, longitude]);
    } else {
        // Add a new marker for the bus
        busMarkers[driverId] = L.marker([latitude, longitude], {
            icon: L.icon({
                iconUrl: 'bus-icon.png', // Make sure this image is in your project
                iconSize: [40, 40]
            })
        }).addTo(map).bindPopup(`Bus ${driverId}`);
    }
}

// Function to fetch and update bus locations from localStorage
function trackBuses() {
    let buses = JSON.parse(localStorage.getItem('busLocations')) || {};
    Object.keys(buses).forEach(driverId => {
        let { latitude, longitude } = buses[driverId];
        updateBusLocation(driverId, latitude, longitude);
    });
}

// Periodically update the bus locations
timer = setInterval(trackBuses, 5000);

