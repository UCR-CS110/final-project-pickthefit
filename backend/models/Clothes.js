import mongoose from "mongoose";

const clothesSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    imageUrl: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Clothes", clothesSchema);