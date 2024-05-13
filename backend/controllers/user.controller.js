import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import mongoose from "mongoose";

export const signupUser = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;

		const user = await User.findOne({ $or: [{ email }, { username }] });

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters long." });
		}

		if (user) {
			return res.status(400).json({ error: "User already existed!" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			username,
			password: hashedPassword,
		});

		await newUser.save();

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signupUser controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password!" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in loginUser controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const logoutUser = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "Logout successfully!" });
	} catch (error) {
		console.log("Error in logoutUser controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const followUnFollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res
				.status(400)
				.json({ error: "You cannot follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) {
			return res.status(404).json({ error: "User can't be found" });
		}

		const isFollowing = currentUser.following.includes(userToModify._id);
		if (isFollowing) {
			// Unfollow
			// remove currentUser from followers array of userToModify
			await User.findByIdAndUpdate(userToModify._id, {
				$pull: { followers: currentUser._id },
			});
			// remove userToModify from following array of currentUser
			await User.findByIdAndUpdate(currentUser._id, {
				$pull: { following: userToModify._id },
			});
			res.status(200).json({ message: "Unfollow success" });
		} else {
			// Follow
			// add currentUser from followers array of userToModify
			await User.findByIdAndUpdate(userToModify._id, {
				$push: { followers: currentUser._id },
			});
			// add userToModify from following array of currentUser
			await User.findByIdAndUpdate(currentUser._id, {
				$push: { following: userToModify._id },
			});
			res.status(200).json({ message: "Follow success" });
		}
	} catch (error) {
		console.log("Error in followUnFollowUser controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { name, email, password, username, bio } = req.body;
	let { profilePic } = req.body;
	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User can't be found" });
		}

		if (req.params.id !== userId.toString()) {
			return res
				.status(401)
				.json({ error: "Unauthorized: You can't update other's profile" });
		}

		if (password) {
			if (password.length < 6) {
				return res
					.status(400)
					.json({ error: "Password must be at least 6 characters long" });
			} else {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);
				user.password = hashedPassword;
			}
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(
					user.profilePic.split("/").pop().split(".")[0]
				);
			}
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		await Post.updateMany(
			{
				"replies.userId": userId,
			},
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].profilePic": user.profilePic,
				},
			},
			{
				arrayFilters: [{ "reply.userId": userId }],
			}
		);

		user.password = null;

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getUserProfile = async (req, res) => {
	// this function handle either username or objectId as params
	const { query } = req.params;
	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query })
				.select("-password")
				.select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query })
				.select("-password")
				.select("-updatedAt");
		}

		if (!user) {
			return res.status(404).json({ error: "User can't be found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile controller ", error.message);
		res.status(500).json({ error: error.message });
	}
};
