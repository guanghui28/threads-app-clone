import {
	Avatar,
	AvatarBadge,
	Flex,
	Image,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
	WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import selectedConversationAtom from "../atoms/selectedConversationAtom";

const Conversation = ({ conversation }) => {
	const [selectedConversation, setSelectedConversation] = useRecoilState(
		selectedConversationAtom
	);
	const currentUser = useRecoilValue(userAtom);
	const user = conversation.participants[0];
	const lastMessage = conversation.lastMessage;
	const colorMode = useColorMode();

	return (
		<Flex
			gap={4}
			alignItems="center"
			p={1}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.600", "gray.dark"),
				color: "white",
			}}
			borderRadius="md"
			onClick={() =>
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					profilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			bg={
				selectedConversation?._id === conversation._id
					? colorMode === "light"
						? "gray.600"
						: "gray.dark"
					: ""
			}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic}
				>
					<AvatarBadge boxSize="1em" bg="green.500" />
				</Avatar>
			</WrapItem>
			<Stack direction="column" fontSize="sm">
				<Text fontWeight="700" display="flex" alignItems="center">
					{user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
				</Text>
				<Text fontSize="xs" display="flex" alignItems="center">
					{currentUser._id === lastMessage.sender ? (
						<BsCheck2All size={16} />
					) : (
						""
					)}
					{lastMessage.text.length > 18
						? lastMessage.text.slice(0, 18) + "..."
						: lastMessage.text}
				</Text>
			</Stack>
		</Flex>
	);
};

export default Conversation;
