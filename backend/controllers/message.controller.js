import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

export const sendMessage = async (req, res) => {
	try {
		const { recipientId, message } = req.body;
		let { img } = req.body;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [recipientId, senderId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "",
		});

		const recipientSocketId = getRecipientSocketId(recipientId);
		if (recipientSocketId) {
			io.to(recipientSocketId).emit("newMessage", newMessage);
		}

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMessages = async (req, res) => {
	const { otherUserId } = req.params;
	const userId = req.user._id;
	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [otherUserId, userId] },
		});

		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found!" });
		}

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getConversations = async (req, res) => {
	const userId = req.user._id;
	try {
		let conversations = await Conversation.find({
			participants: userId,
		}).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array

		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.find(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});

		res.status(200).json(conversations);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
