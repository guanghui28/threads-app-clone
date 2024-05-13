import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import conversationsAtom from "../atoms/conversationsAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage";

const MessageInput = ({ setMessages }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const [messageText, setMessageText] = useState("");
	const [sending, setSending] = useState(false);
	const showToast = useShowToast();
	const imageRef = useRef(null);
	const { onClose } = useDisclosure();
	const { imgUrl, handleImageChange, setImgUrl } = usePreviewImage();

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (sending) {
			return showToast("Error", "Message is sending, wait a second!", "error");
		}
		if (!messageText && !imgUrl) {
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
					img: imgUrl || "",
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
			setImgUrl("");
			onClose();
		}
	};
	return (
		<Flex alignItems="center" gap={2}>
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
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
			<Flex flex={5} cursor="pointer">
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w="full">
							<Image src={imgUrl} alt="image" />
						</Flex>
						<Flex justifyContent="flex-end" my={2}>
							{!sending ? (
								<IoSendSharp
									size={24}
									cursor="pointer"
									onClick={handleSendMessage}
								/>
							) : (
								<Spinner size="md" />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default MessageInput;
