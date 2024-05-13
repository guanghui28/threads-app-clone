import { SearchIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Input,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import conversationsAtom from "../atoms/conversationsAtom";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
	const currentUser = useRecoilValue(userAtom);
	const [selectedConversation, setSelectedConversation] = useRecoilState(
		selectedConversationAtom
	);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const { socket, onlineUsers } = useSocket();
	const [loadingConversations, setLoadingConversations] = useState(false);
	const [searchingUser, setSearchingUser] = useState(false);
	const [searchText, setSearchText] = useState("");
	const showToast = useShowToast();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prevConversations) =>
				prevConversations.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				})
			);
		});
	}, [setConversations, socket]);

	useEffect(() => {
		const getConversations = async () => {
			setLoadingConversations(true);
			try {
				const res = await fetch(`/api/messages/conversations`);
				const data = await res.json();

				if (data.error) {
					return showToast("Error", data.error, "error");
				}
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};
		getConversations();
	}, [showToast, setConversations]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		if (searchingUser) {
			return showToast("Error", "Wait a second!", "error");
		}
		if (searchText.length < 3) {
			return showToast("Error", "Must be at least 3 characters long!", "error");
		}
		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();

			if (searchedUser.error) {
				return showToast("Error", searchedUser.error, "error");
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				return showToast("Error", "You can't message yourself", "error");
			}

			const conversationAlreadyExisted = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);
			if (conversationAlreadyExisted) {
				setSelectedConversation({
					_id: conversationAlreadyExisted._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					profilePic: searchedUser.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};

			setConversations((prevConversations) => [
				...prevConversations,
				mockConversation,
			]);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
			setSearchText("");
		}
	};

	return (
		<Box
			position="absolute"
			left="50%"
			transform="translateX(-50%)"
			w={{
				base: "100%",
				md: "80%",
				lg: "750px",
			}}
			p={4}
		>
			<Flex
				flexDirection={{
					base: "column",
					md: "row",
				}}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx="auto"
				gap={4}
			>
				<Flex
					flex={30}
					gap={2}
					flexDirection={"column"}
					maxW={{
						sm: "250px",
						md: "full",
					}}
					mx="auto"
				>
					<Text
						fontWeight="700"
						color={useColorModeValue("gray.600", "gray.400")}
					>
						Your conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems="center" gap={2}>
							<Input
								type="text"
								placeholder="Search for a user"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Button size="sm" type="submit" isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>
					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex
								key={i}
								gap={4}
								alignItems={"center"}
								p={"1"}
								borderRadius="md"
							>
								<Box>
									<SkeletonCircle size={10} />
								</Box>
								<Flex w="full" flexDirection={"column"} gap={3}>
									<Skeleton h="10px" w="80px" />
									<Skeleton h="8px" w="90%" />
								</Flex>
							</Flex>
						))}
					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}
								isOline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))}
				</Flex>
				{!selectedConversation?._id && (
					<Flex
						flex={70}
						borderRadius="md"
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height="400px"
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}
				{selectedConversation?._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;
