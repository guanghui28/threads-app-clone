import { Avatar, Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";

import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(false);
	const currentUser = useRecoilValue(userAtom);
	const [deleting, setDeleting] = useState(false);

	const navigate = useNavigate();

	// fetch user
	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/users/profile/${postedBy}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		e.preventDefault();
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		setDeleting(true);
		try {
			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				return showToast("Error", data.error, "error");
			}

			showToast("Success", "Deleted post successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setDeleting(false);
		}
	};

	if (!user || loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size="xl" />
			</Flex>
		);
	}

	return (
		<Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size={"md"}
						name={user.username}
						src={user.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box h={"full"} w={"1px"} bg={"gray.light"} my={2}></Box>
					<Box w={"full"} position="relative">
						{post.replies.length === 0 && <Text textAlign="center">🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size="xs"
								name={post.replies[0].username}
								src={post.replies[0].profilePic}
								position={"absolute"}
								top="0px"
								left="15px"
								padding="2px"
							/>
						)}
						{post.replies[1] && (
							<Avatar
								size="xs"
								name={post.replies[1].username}
								src={post.replies[1].profilePic}
								position={"absolute"}
								bottom="0px"
								right="-5px"
								padding="2px"
							/>
						)}
						{post.replies[2] && (
							<Avatar
								size="xs"
								name={post.replies[2].username}
								src={post.replies[2].profilePic}
								position={"absolute"}
								bottom="0px"
								left="4px"
								padding="2px"
							/>
						)}
					</Box>
				</Flex>
				<Flex flexDirection="column" flex={1} gap={2}>
					<Flex w={"full"} justifyContent={"space-between"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize="sm" fontWeight={"bold"}>
								{user.username}
							</Text>
							<Image src="/verified.png" w={4} h={4} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text
								fontSize={"sm"}
								w={36}
								textAlign="right"
								color={"gray.light"}
							>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
							{currentUser?._id === user._id && (
								<DeleteIcon size={20} onClick={handleDeletePost} />
							)}
						</Flex>
					</Flex>
					<Text fontSize={"sm"}>{post.text}</Text>
					{post.img && (
						<Box
							borderRadius={6}
							overflow="hidden"
							border={"1px solid"}
							borderColor={"gray.light"}
						>
							<Image src={post.img} w="full" />
						</Box>
					)}

					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default Post;
