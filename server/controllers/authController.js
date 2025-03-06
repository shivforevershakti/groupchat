const User = require("../models/user");

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { email , username } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false , message: "User already taken" });
        }


        // Save new user
        const newUser = new User({ username, email });
        await newUser.save();

        res.status(201).json({ success:true ,message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false , message: "Server error", error });
    }
};
