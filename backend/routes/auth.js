import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  console.log("BODY:", req.body);
  try {
    const { username, password } = req.body;

    // 1. check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create user
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false });
    }

    return res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

export default router;