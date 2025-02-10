document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
        // Store login token or session
        localStorage.setItem("adminToken", data.token);
        
        // Redirect to the admin dashboard
        window.location.href = "admin.html";
    } else {
        alert("Login failed: " + data.message);
    }
});
