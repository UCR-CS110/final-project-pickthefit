import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";
import clothesRoutes from "./routes/clothesRoutes.js";
import postRoutes from "./routes/posts.js";
import mongoSanitize from "express-mongo-sanitize";


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/clothes", clothesRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/posts", postRoutes);
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Pick The Fit API Running");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});