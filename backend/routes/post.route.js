import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
	createPost,
	getPost,
	deletePost,
	likeUnlikePost,
	replyPost,
	getFeedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyPost);

export default router;
