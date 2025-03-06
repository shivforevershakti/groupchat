const express = require("express");
const { registerUser } = require("../controllers/authController");

const router = express.Router();

// Register User Route
router.post("/register", registerUser);

module.exports = router;
