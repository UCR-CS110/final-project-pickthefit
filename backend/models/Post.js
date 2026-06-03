import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    name: String,
    description: String,
    items: Array,
    userId: String,
  
    likes: {
      type: [String], // userIds who liked
      default: []
    },
  
    dislikes: {
      type: [String], // userIds who disliked
      default: []
    },
  
    createdAt: {
      type: Date,
      default: Date.now
    },

    comments: [
        {
          userId: String,
          username: String,
          text: String,
          replies: [
            {
              userId: String,
              username: String,
              text: String
            }
          ]
        }
      ]
  });

export default mongoose.model("Post", PostSchema);