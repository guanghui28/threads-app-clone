import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import conversationsAtom from "../atoms/conversationsAtom";

const MessageInput = ({ setMessages }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const [messageText, setMessageText] = useState("");
	const [sending, setSending] = useState(false);
	const showToast = useShowToast();

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (sending) {
			return showToast("Error", "Message is sending, wait a second!", "error");
		}
		if (!messageText) {
			return showToast("Error", "Empty message can't send", "error");
		}
		setSending(true);
		try {
			const res = await fetch(`/api/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					recipientId: selectedConversation.userId,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
			}

			setConversations((prevConversations) =>
				prevConversations.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				})
			);

			setMessages((messages) => [...messages, data]);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSending(false);
			setMessageText("");
		}
	};
	return (
		<form onSubmit={handleSendMessage}>
			<InputGroup>
				<Input
					w="full"
					placeholder="Type a message"
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
				/>
				<InputRightElement
					onClick={handleSendMessage}
					cursor={"pointer"}
					color="green.500"
					_hover={{
						color: "green.800",
					}}
				>
					<IoSendSharp />
				</InputRightElement>
			</InputGroup>
		</form>
	);
};

export default MessageInput;
