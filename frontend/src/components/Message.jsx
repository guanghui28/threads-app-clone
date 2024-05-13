import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import selectedConversationAtom from "../atoms/selectedConversationAtom";
import userAtom from "../atoms/userAtom";
import { CheckIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const currentUser = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf="flex-end">
					{message.text && (
						<Flex bg="green.800" maxW="350px" p={1} borderRadius="md">
							<Text color="white">{message.text}</Text>
							<Box alignSelf="flex-end" ml={1} fontWeight="bold">
								<CheckIcon
									size={16}
									color={message.seen ? "blue.400" : "gray.200"}
								/>
							</Box>
						</Flex>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w="200px">
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt="Image"
								borderRadius={4}
							/>
							<Skeleton w="200px" h="200px" />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w="200px">
							<Image src={message.img} alt="Image" borderRadius={4} />
							<Box alignSelf="flex-end" ml={1} fontWeight="bold">
								<CheckIcon
									size={16}
									color={message.seen ? "blue.400" : "gray.200"}
								/>
							</Box>
						</Flex>
					)}

					<Avatar src={currentUser.profilePic} w={7} h={7} />
				</Flex>
			) : (
				<Flex gap={2} alignSelf="flex-start">
					<Avatar src={selectedConversation.profilePic} w={7} h={7} />
					{message.text && (
						<Text
							maxW="350px"
							bg="gray.400"
							p={1}
							borderRadius="md"
							color="black"
						>
							{message.text}
						</Text>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w="200px">
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt="Image"
								borderRadius={4}
							/>
							<Skeleton w="200px" h="200px" />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w="200px">
							<Image src={message.img} alt="Image" borderRadius={4} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;
