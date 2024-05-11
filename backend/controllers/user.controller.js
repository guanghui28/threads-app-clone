import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

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
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signupUser controller ", error.message);
		res.status(500).json({ message: error.message });
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
		});
	} catch (error) {
		console.log("Error in loginUser controller ", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logoutUser = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "Logout successfully!" });
	} catch (error) {
		console.log("Error in logoutUser controller ", error.message);
		res.status(500).json({ message: error.message });
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
				.json({ message: "You cannot follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) {
			return res.status(404).json({ message: "User can't be found" });
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
		res.status(500).json({ message: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { name, email, password, username, profilePic, bio } = req.body;
	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User can't be found" });
		}

		if (req.params.id !== userId.toString()) {
			return res
				.status(401)
				.json({ message: "Unauthorized: You can't update other's profile" });
		}

		if (password) {
			if (password.length < 6) {
				return res
					.status(400)
					.json({ message: "Password must be at least 6 characters long" });
			} else {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);
				user.password = hashedPassword;
			}
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		await user.save();

		res.status(200).json({ message: "Profile update successfully", user });
	} catch (error) {
		console.log("Error in updateUser controller ", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await User.findOne({ username })
			.select("-password")
			.select("-updatedAt");
		if (!user) {
			return res.status(404).json({ message: "User can't be found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile controller ", error.message);
		res.status(500).json({ message: error.message });
	}
};
