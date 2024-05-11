import {
	Avatar,
	Box,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {
	const toast = useToast();
	const copyUrl = async () => {
		const currentUrl = window.location.href;
		console.log(window);
		await navigator.clipboard.writeText(currentUrl);
		toast({
			title: "Copy URL",
			status: "success",
			description: "Profile link was copied",
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						Mark Zuckerberg
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>Zuckerberg</Text>
						<Text
							fontSize={"xs"}
							bg={"gray.dark"}
							color={"gray.light"}
							p={1}
							borderRadius={"full"}
						>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					<Avatar
						name="Mark Zuckerberg"
						src="/zuck-avatar.png"
						size={{
							base: "md",
							md: "xl",
						}}
					/>
				</Box>
			</Flex>
			<Text>Co-founder, executive chairman and CEO of Meta Platforms.</Text>
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>3.2K followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
					<Text color={"gray.light"}>instagram.com</Text>
				</Flex>
				<Flex>
					<Box className="icon-container">
						<BsInstagram size={24} cursor={"pointer"} />
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<MenuList bg={"gray.dark"}>
								<MenuItem bg={"gray.dark"} onClick={copyUrl}>
									Copy link
								</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<Flex w={"full"}>
				<Flex
					flex={1}
					justifyContent={"center"}
					pd={3}
					cursor={"pointer"}
					borderBottom={"1.5px solid white"}
				>
					<Text fontWeight={"bold"}>Threads</Text>
				</Flex>
				<Flex
					flex={1}
					justifyContent={"center"}
					pd={3}
					cursor={"pointer"}
					borderBottom={"1.5px solid gray"}
					color={"gray.light"}
				>
					<Text fontWeight={"bold"}>Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
