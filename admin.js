document.addEventListener("DOMContentLoaded", function () {
    const addStudentBtn = document.getElementById("add-student-btn");
    const addDriverBtn = document.getElementById("add-driver-btn");
    const studentList = document.getElementById("student-list");
    const driverList = document.getElementById("driver-list");
    
    loadStudents();
    loadDrivers();
    
    addStudentBtn.addEventListener("click", function () {
        const studentId = document.getElementById("student-id").value;
        if (studentId) {
            let students = JSON.parse(localStorage.getItem("students")) || [];
            if (!students.includes(studentId)) {
                students.push(studentId);
                localStorage.setItem("students", JSON.stringify(students));
                loadStudents();
            } else {
                alert("Student ID already exists!");
            }
        }
    });
    
    addDriverBtn.addEventListener("click", function () {
        const driverUsername = document.getElementById("driver-username").value;
        const driverPassword = document.getElementById("driver-password").value;
        if (driverUsername && driverPassword) {
            let drivers = JSON.parse(localStorage.getItem("drivers")) || [];
            let driverData = { username: driverUsername, password: driverPassword };
            
            if (!drivers.some(driver => driver.username === driverUsername)) {
                drivers.push(driverData);
                localStorage.setItem("drivers", JSON.stringify(drivers));
                loadDrivers();
            } else {
                alert("Driver username already exists!");
            }
        }
    });
    
    function loadStudents() {
        studentList.innerHTML = "";
        let students = JSON.parse(localStorage.getItem("students")) || [];
        students.forEach(studentId => {
            let li = document.createElement("li");
            li.textContent = studentId;
            let removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", function () {
                students = students.filter(id => id !== studentId);
                localStorage.setItem("students", JSON.stringify(students));
                loadStudents();
            });
            li.appendChild(removeBtn);
            studentList.appendChild(li);
        });
    }
    
    function loadDrivers() {
        driverList.innerHTML = "";
        let drivers = JSON.parse(localStorage.getItem("drivers")) || [];
        drivers.forEach(driver => {
            let li = document.createElement("li");
            li.textContent = `${driver.username} (Hidden Password)`;
            let removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", function () {
                drivers = drivers.filter(d => d.username !== driver.username);
                localStorage.setItem("drivers", JSON.stringify(drivers));
                loadDrivers();
            });
            li.appendChild(removeBtn);
            driverList.appendChild(li);
        });
    }
});

