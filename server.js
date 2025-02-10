require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  role: String, // "admin", "driver", "student"
  studentID: String, // Only for students
  busID: String, // Only for drivers
  password: String,
}));

const BusLocation = mongoose.model("BusLocation", new mongoose.Schema({
  busID: String,
  latitude: Number,
  longitude: Number,
  updatedAt: { type: Date, default: Date.now },
}));

// 🔹 Admin - Add Student or Driver
app.post("/admin/add-user", async (req, res) => {
  const { name, role, studentID, busID, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ name, role, studentID, busID, password: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding user" });
  }
});

// 🔹 Admin - Remove User
app.post("/admin/remove-user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.json({ success: true, message: "User removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing user" });
  }
});

// 🔹 User Login (Admin, Student, Driver)
app.post("/login", async (req, res) => {
  const { studentID, busID, password } = req.body;

  try {
    let user;
    if (studentID) user = await User.findOne({ studentID });
    else if (busID) user = await User.findOne({ busID });

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error" });
  }
});

// 🔹 Driver - Update Bus Location
app.post("/driver/update-location", async (req, res) => {
  const { busID, latitude, longitude } = req.body;

  try {
    let bus = await BusLocation.findOne({ busID });
    if (bus) {
      bus.latitude = latitude;
      bus.longitude = longitude;
      bus.updatedAt = new Date();
      await bus.save();
    } else {
      bus = new BusLocation({ busID, latitude, longitude });
      await bus.save();
    }
    io.emit("busLocationUpdate", { busID, latitude, longitude });
    res.json({ success: true, message: "Location updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating location" });
  }
});

// 🔹 Student - Get All Bus Locations
app.get("/student/bus-locations", async (req, res) => {
  try {
    const buses = await BusLocation.find();
    res.json({ success: true, buses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bus locations" });
  }
});

// 🔹 WebSocket - Real-Time Tracking
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
