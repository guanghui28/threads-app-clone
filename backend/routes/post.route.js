import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
	createPost,
	getPost,
	deletePost,
	likeUnlikePost,
	replyPost,
	getFeedPosts,
	getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyPost);

export default router;
