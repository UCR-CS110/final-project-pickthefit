import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

/* CREATE POST */
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const saved = await newPost.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL POSTS (for home page feed) */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.post("/:id/like", async (req, res) => {
    try {
      const { userId } = req.body;
  
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // remove dislike if exists
      post.dislikes = post.dislikes.filter(id => id !== userId);
  
      // toggle like
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
      }
  
      await post.save();
  
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.post("/:id/dislike", async (req, res) => {
    try {
      const { userId } = req.body;
  
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // remove like if exists
      post.likes = post.likes.filter(id => id !== userId);
  
      // toggle dislike
      if (post.dislikes.includes(userId)) {
        post.dislikes = post.dislikes.filter(id => id !== userId);
      } else {
        post.dislikes.push(userId);
      }
  
      await post.save();
  
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.post("/:id/comment", async (req, res) => {
    const { userId, username, text } = req.body;
  
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
  
    post.comments.push({
    //   _id: new Date().getTime().toString(),
      userId,
      username,
      text,
      replies: [],
      createdAt: new Date()
    });
  
    await post.save();
  
    res.json(post); // 🔥 ALWAYS return full updated post
  });

  router.post("/:id/comment/reply", async (req, res) => {
    const { commentId, userId, username, text } = req.body;
  
    const post = await Post.findById(req.params.id);
  
    const comment = post.comments.find(
        c => c._id.toString() === commentId
    );

    comment.replies.push({
    //   _id: new Date().getTime().toString(),
      userId,
      username,
      text,
      createdAt: new Date()
    });
  
    await post.save();
  
    res.json(post);
  });

  router.delete("/:postId/comment/:commentId/reply/:replyId", async (req, res) => {
    const post = await Post.findById(req.params.postId);
  
    const comment = post.comments.id(req.params.commentId);
  
    comment.replies = comment.replies.filter(
      r => r._id.toString() !== req.params.replyId
    );
  
    await post.save();
    res.json(post);
  });

  router.delete("/:postId/comment/:commentId", async (req, res) => {
    const post = await Post.findById(req.params.postId);
  
    post.comments = post.comments.filter(
      c => c._id.toString() !== req.params.commentId
    );
  
    await post.save();
    res.json(post);
  });

export default router;