import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Clothes from "../models/Clothes.js";

const router = express.Router();

/* multer - upload image */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

/* getting clothes for specific user */
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = userId ? { userId } : {};

        const items = await Clothes.find(filter).sort({
            createdAt: -1
        });

        res.json(items);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

/* create clothing item */
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const newItem = new Clothes({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            userId: req.body.userId,
            imageUrl: req.file
                ? `http://localhost:5050/uploads/${req.file.filename}`
                : ""
        });

        const saved = await newItem.save();

        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

/* delete clothing item */
router.delete("/:id", async (req, res) => {
    try {
        const item = await Clothes.findById(req.params.id);

        if (!item) {
            return res
                .status(404)
                .json({ message: "Item not found" });
        }

        // deleting image
        if (item.imageUrl) {
            const filename = item.imageUrl.split("/uploads/")[1];

            const filePath = path.join(
                process.cwd(),
                "uploads",
                filename
            );

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("File delete error:", err.message);
                }
            });
        }

        // deleting from mongoDB
        await Clothes.findByIdAndDelete(req.params.id);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

export default router;