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

    return res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

router.get("/search", async (req, res) => {
  try {
    const search = req.query.username;

    const users = await User.find({
      username: {
        $regex: search,
        $options: "i"
      }
    }).select("_id username");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post("/follow", async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    const currentUser =
      await User.findById(currentUserId);

    const targetUser =
      await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (
      !currentUser.following.includes(targetUserId)
    ) {
      currentUser.following.push(targetUserId);

      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();
    }

    res.json({
      success: true,
      currentUser,
      targetUser
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "_id username")
      .populate("following", "_id username");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/bio", async (req, res) => {
  try {
    const { userId, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { bio, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        bio,
        profilePicture
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove from current user's following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );

    // remove from target user's followers
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
      currentUser,
      targetUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;