import {
	Avatar,
	Divider,
	Flex,
	Image,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useRecoilValue } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
	const currentUser = useRecoilValue(userAtom);
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const showToast = useShowToast();

	useEffect(() => {
		const getMessages = async () => {
			if (selectedConversation.mock) return;
			setLoading(true);
			setMessages([]);
			try {
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();
				if (data.error) {
					return showToast("Error", data.error, "error");
				}
				console.log("conversations: ", data);
				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

	return (
		<Flex
			flex={70}
			bg={useColorModeValue("gray.200", "gray.dark")}
			borderRadius={"md"}
			p={2}
			flexDirection={"column"}
		>
			<Flex w="full" h={12} alignItems="center" gap={2}>
				<Avatar src={selectedConversation.profilePic} size={"sm"} />
				<Text display="flex" alignItems="center">
					{selectedConversation.username}{" "}
					<Image src="/verified.png" w={4} ml={1} />
				</Text>
			</Flex>
			<Divider />
			<Flex
				flexDir={"column"}
				gap={4}
				my={4}
				p={2}
				height="400px"
				overflowY={"auto"}
			>
				{loading &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems="center"
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDirection={"column"} gap="2">
								<Skeleton h="8px" w="250px" />
								<Skeleton h="8px" w="250px" />
								<Skeleton h="8px" w="250px" />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}
				{!loading &&
					messages.map((message) => (
						<Message
							key={message._id}
							ownMessage={message.sender === currentUser._id}
							message={message}
						/>
					))}
			</Flex>
			<MessageInput setMessages={setMessages} />
		</Flex>
	);
};

export default MessageContainer;
