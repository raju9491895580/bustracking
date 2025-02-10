document.addEventListener("DOMContentLoaded", function () {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
        window.location.href = "login.html"; // Redirect to login if not logged in
        return;
    }

    const map = L.map("map").setView([0, 0], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let busMarker = L.marker([0, 0], {
        icon: L.icon({
            iconUrl: "bus-icon.png", // Ensure this file exists
            iconSize: [40, 40]
        })
    }).addTo(map);

    function updateBusLocation() {
        fetch("bus_location.json") // Replace with a real API endpoint
            .then(response => response.json())
            .then(data => {
                if (data.latitude && data.longitude) {
                    const lat = data.latitude;
                    const lon = data.longitude;
                    busMarker.setLatLng([lat, lon]);
                    map.setView([lat, lon], 13);
                }
            })
            .catch(error => console.error("Error fetching bus location:", error));
    }

    setInterval(updateBusLocation, 5000); // Update every 5 seconds
});
