import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log(`server is running at http://localhost:${PORT}`);
});
