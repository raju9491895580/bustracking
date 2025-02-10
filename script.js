document.addEventListener("DOMContentLoaded", function () {
    const userType = localStorage.getItem("userType");
    if (userType === "driver") {
        initializeDriverTracking();
    } else if (userType === "student" || userType === "admin") {
        initializeTrackingMap();
    }
});

// Function to start location tracking for drivers
function initializeDriverTracking() {
    const startSharingBtn = document.getElementById("startSharing");
    const stopSharingBtn = document.getElementById("stopSharing");

    startSharingBtn.addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    localStorage.setItem("driverLocation", JSON.stringify({ latitude, longitude }));
                    updateDriverMap(latitude, longitude);
                },
                (error) => {
                    console.error("Error fetching location", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    stopSharingBtn.addEventListener("click", function () {
        localStorage.removeItem("driverLocation");
    });
}

// Function to initialize tracking map for students and admin
function initializeTrackingMap() {
    const map = L.map("trackingMap").setView([0, 0], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    const busIcon = L.icon({
        iconUrl: "bus-icon.png", // Replace with actual bus icon path
        iconSize: [40, 40],
    });

    const marker = L.marker([0, 0], { icon: busIcon }).addTo(map);

    setInterval(() => {
        const driverLocation = JSON.parse(localStorage.getItem("driverLocation"));
        if (driverLocation) {
            marker.setLatLng([driverLocation.latitude, driverLocation.longitude]);
            map.setView([driverLocation.latitude, driverLocation.longitude], 15);
        }
    }, 3000);
}

// Function to update driver tracking page
function updateDriverMap(latitude, longitude) {
    const map = L.map("driverMap").setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 15);
}
