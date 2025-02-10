document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const userId = document.getElementById("userId").value;
            const password = document.getElementById("password").value;
            const userType = document.getElementById("userType").value; // Admin, Student, or Driver

            let endpoint = "";

            // Determine API endpoint based on user type
            if (userType === "admin") {
                endpoint = "/admin/login";
            } else if (userType === "driver") {
                endpoint = "/driver/login";
            } else if (userType === "student") {
                endpoint = "/student/login";
            } else {
                alert("Invalid user type selected.");
                return;
            }

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    localStorage.setItem("authToken", data.token);
                    localStorage.setItem("userType", userType);

                    // Redirect user based on role
                    if (userType === "admin") {
                        window.location.href = "admin.html";
                    } else if (userType === "driver") {
                        window.location.href = "driver.html";
                    } else if (userType === "student") {
                        window.location.href = "student.html";
                    }
                } else {
                    alert("Login failed: " + data.message);
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert("Server error. Please try again later.");
            }
        });
    }

    // Logout function
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            window.location.href = "index.html"; // Redirect to login page
        });
    }

    // Check authentication and redirect if not logged in
    function checkAuth() {
        const token = localStorage.getItem("authToken");
        const userType = localStorage.getItem("userType");

        if (!token) {
            alert("Please log in first!");
            window.location.href = "index.html";
        }

        // Redirect users if they access a page that doesn’t match their role
        if (window.location.pathname.includes("admin.html") && userType !== "admin") {
            alert("Unauthorized access!");
            window.location.href = "index.html";
        }
        if (window.location.pathname.includes("driver.html") && userType !== "driver") {
            alert("Unauthorized access!");
            window.location.href = "index.html";
        }
        if (window.location.pathname.includes("student.html") && userType !== "student") {
            alert("Unauthorized access!");
            window.location.href = "index.html";
        }
    }

    // Run authentication check on protected pages
    if (window.location.pathname !== "index.html") {
        checkAuth();
    }
});
