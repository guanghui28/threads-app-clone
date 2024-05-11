import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";

const UserPost = ({ likes, replies, postTitle, postImg }) => {
	const [liked, setLiked] = useState(false);

	return (
		<Link to="/markzuckerberg/post/1">
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size={"md"} name="Mark Zuckerberg" src="/zuck-avatar.png" />
					<Box h={"full"} w={"1px"} bg={"gray.light"} my={2}></Box>
					<Box w={"full"} position="relative">
						<Avatar
							size="xs"
							name="John Doe"
							src="https://bit.ly/dan-abramov"
							position={"absolute"}
							top="0px"
							left="15px"
							padding="2px"
						/>
						<Avatar
							size="xs"
							name="John Doe"
							src="https://bit.ly/code-beast"
							position={"absolute"}
							bottom="0px"
							right="-5px"
							padding="2px"
						/>
						<Avatar
							size="xs"
							name="John Doe"
							src="https://bit.ly/ryan-florence"
							position={"absolute"}
							bottom="0px"
							left="4px"
							padding="2px"
						/>
					</Box>
				</Flex>
				<Flex flexDirection="column" flex={1} gap={2}>
					<Flex w={"full"} justifyContent={"space-between"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize="sm" fontWeight={"bold"}>
								markzuckerberg
							</Text>
							<Image src="/verified.png" w={4} h={4} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontSize={"sm"} color={"gray.light"}>
								1d
							</Text>
							<BsThreeDots />
						</Flex>
					</Flex>
					<Text fontSize={"sm"}>{postTitle}</Text>
					{postImg && (
						<Box
							borderRadius={6}
							overflow="hidden"
							border={"1px solid"}
							borderColor={"gray.light"}
						>
							<Image src={postImg} w="full" />
						</Box>
					)}

					<Flex gap={3} my={1}>
						<Actions liked={liked} setLiked={setLiked} />
					</Flex>
					<Flex alignItems={"center"} gap={2}>
						<Text fontSize="sm" color="gray.light">
							{replies} replies
						</Text>
						<Box w={0.5} h={0.5} borderRadius="full" bg="gray.light"></Box>
						<Text fontSize="sm" color="gray.light">
							{likes} likes
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default UserPost;
