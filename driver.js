document.addEventListener("DOMContentLoaded", () => {
    const shareLocationBtn = document.getElementById("shareLocationBtn");
    const stopSharingBtn = document.getElementById("stopSharingBtn");
    const driverMap = L.map("driverMap").setView([0, 0], 15);
    const driverMarker = L.marker([0, 0], { icon: busIcon }).addTo(driverMap);
    let watchId = null;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(driverMap);

    function updateDriverLocation(position) {
        const { latitude, longitude } = position.coords;
        driverMarker.setLatLng([latitude, longitude]);
        driverMap.setView([latitude, longitude], 15);
        localStorage.setItem("driverLocation", JSON.stringify({ latitude, longitude }));
    }

    function startSharingLocation() {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(updateDriverLocation, (error) => {
                console.error("Error fetching location:", error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    function stopSharingLocation() {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            localStorage.removeItem("driverLocation");
        }
    }

    shareLocationBtn.addEventListener("click", startSharingLocation);
    stopSharingBtn.addEventListener("click", stopSharingLocation);

    // Load previous location if available
    const storedLocation = JSON.parse(localStorage.getItem("driverLocation"));
    if (storedLocation) {
        driverMarker.setLatLng([storedLocation.latitude, storedLocation.longitude]);
        driverMap.setView([storedLocation.latitude, storedLocation.longitude], 15);
    }
});
