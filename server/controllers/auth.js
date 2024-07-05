// controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ForumProfile = require("../models/forum/profile");

// Signup controller
const signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(200).json({ message: "User already exists" });
    // Create a new user
    const newUser = new User({ email, password, role });
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    newUser.password = hashedPassword;
    // Save the user to the database
    await newUser.save();
    // Generate a JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        createdAt: newUser.createdAt,
        role: newUser.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // datenow in seconds + 7 days
      },
      process.env.SECRET_KEY
    );

    // CONDITION RUNS ONLY ONCE PER USER TO ASSIGN A FORUM PROFILE
    // creates a forum profile object for the user
    // to track forum statistics (days visited, read time, etc).
    const newForumProfile = new ForumProfile({ user: newUser._id });
    await newForumProfile.save();

    // Send the token to the client
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Signin controller
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    // If the user does not exist, return an error
    if (!user) return res.status(200).json({ message: "Email or password incorrect" });
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    // If the passwords don't match, return an error
    if (!passwordMatch) return res.status(200).json({ message: "Email or password incorrect" });
    // Generate a JWT token upon successful login
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // datenow in seconds + 7 days
      },
      process.env.SECRET_KEY
    );
    // Send the token to the client
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, signin };
