import {
	Avatar,
	Box,
	Button,
	Flex,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

const UserHeader = ({ user }) => {
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnFollow, following, updating } = useFollowUnFollow(user);
	const showToast = useShowToast();

	const copyUrl = async () => {
		const currentUrl = window.location.href;
		console.log(window);
		await navigator.clipboard.writeText(currentUrl);
		showToast("Copy URL", "Profile link was copied", "success");
	};

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
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
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic || "https://bit.ly/broken-link"}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>
			<Text>{user.bio}</Text>
			{user._id === currentUser?._id && (
				<Link as={RouterLink} to="/update">
					<Button size="sm">Update Profile</Button>
				</Link>
			)}
			{user._id !== currentUser?._id && (
				<Button size="sm" onClick={handleFollowUnFollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>
						{user?.followers?.length ?? 0} followers
					</Text>
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
