// userRoute.js
const { Router } = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blackListModel");
require("dotenv").config();
const userRouter = Router();

//register
userRouter.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body; 

  try {
    const check = await userModel.findOne({ email });

    if (check) {
      return res
        .status(400)
        .json({ message: "This email is already registered, try to login" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err)
        return res.status(500).json({ message: "Error hashing password" });

      const user = new userModel({
        username,
        email,
        password: hash,
        role // Save role with user data
      });

      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { email, role: user.role };  // Include role in the payload

    const access_token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "60min" }
    );

    const refresh_token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "30min" }
    );

    res.status(200).json({ access_token, refresh_token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


//logout
userRouter.get("/logout", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      res.json({ message: "token header is not present" });
    }

    const token = header.split(" ")[1];

    const blacklist = await blacklistModel.create({ token });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
