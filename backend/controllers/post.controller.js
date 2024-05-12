import Post from "../models/post.model.js";
import User from "../models/user.model.js";

import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
	const { postedBy, text } = req.body;
	let { img } = req.body;
	try {
		if (!postedBy || !text) {
			return res
				.status(400)
				.json({ message: "PostBy and text fields are required!" });
		}

		const user = await User.findById(postedBy);

		if (!user) {
			return res.status(404).json({ error: "User can't be found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res
				.status(401)
				.json({ error: "Unauthorized: You are not authorized" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res
				.status(400)
				.json({ error: "Text field must be maximum 500 characters long!" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			postedBy,
			text,
			img,
		});
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		console.log("Error in createPost controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getPost = async (req, res) => {
	const { id: postId } = req.params;
	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post can't be found" });
		}
		res.status(200).json(post);
	} catch (error) {
		console.log("Error in getPost controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deletePost = async (req, res) => {
	const { id: postId } = req.params;
	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post can't be found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({
				error: "Unauthorized: You are not authorized to delete this post!",
			});
		}

		if (post.img) {
			// delete
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Delete post successfully!" });
	} catch (error) {
		console.log("Error in deletePost controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const likeUnlikePost = async (req, res) => {
	const { id: postId } = req.params;
	const userId = req.user._id;
	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post can't be found" });
		}

		const userLikedPost = post.likes.includes(userId);
		if (userLikedPost) {
			// unlike
			await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
			res.status(200).json({ message: "Unlike post successfully!" });
		} else {
			// like
			await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
			res.status(200).json({ message: "Like post successfully!" });
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const replyPost = async (req, res) => {
	const { id: postId } = req.params;
	const { _id: userId, profilePic, username } = req.user;
	try {
		const { text } = req.body;
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post can't be found" });
		}

		const reply = { userId, text, profilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in replyPost controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getFeedPosts = async (req, res) => {
	const userId = req.user._id;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User can't be found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
			createdAt: -1,
		});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFeedPosts controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ error: "User can't be found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({
			createdAt: -1,
		});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};
