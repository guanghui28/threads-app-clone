import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import userAtom from "../atoms/userAtom";
import { CheckIcon } from "@chakra-ui/icons";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const currentUser = useRecoilValue(userAtom);
	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf="flex-end">
					<Flex bg="green.800" maxW="350px" p={1} borderRadius="md">
						<Text color="white">{message.text}</Text>
						<Box
							alignSelf="flex-end"
							ml={1}
							color={message.seen ? "blue.400" : ""}
							fontWeight="bold"
						>
							<CheckIcon size={16} />
						</Box>
					</Flex>
					<Avatar src={currentUser.profilePic} w={7} h={7} />
				</Flex>
			) : (
				<Flex gap={2} alignSelf="flex-start">
					<Avatar src={selectedConversation.profilePic} w={7} h={7} />
					<Text
						maxW="350px"
						bg="gray.400"
						p={1}
						borderRadius="md"
						color="black"
					>
						{message.text}
					</Text>
				</Flex>
			)}
		</>
	);
};

export default Message;
