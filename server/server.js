require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");


const connectDB = require("./config/database");
const setupWebSocket = require("./websocket/websocket");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");








const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));


// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
