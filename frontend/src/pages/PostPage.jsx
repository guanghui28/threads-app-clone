import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Spinner,
	Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useDeletePost from "../hooks/useDeletePost";
import Comment from "../components/Comment";

const PostPage = () => {
	const currentUser = useRecoilValue(userAtom);

	const { user, loading } = useGetUserProfile();
	const { pid: postId } = useParams();
	const [post, setPost] = useState(null);
	const showToast = useShowToast();
	const { deletePost } = useDeletePost();

	useEffect(() => {
		const getPost = async () => {
			try {
				const res = await fetch(`/api/posts/${postId}`);
				const data = await res.json();

				if (data.error) {
					return showToast("Error", data.error, "error");
				}
				console.log(data);
				setPost(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, postId]);

	if (!user || loading) {
		return (
			<Flex justifyContent="center">
				<Spinner size="xl" />
			</Flex>
		);
	}

	if (!post) return null;

	return (
		<>
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} name={user.name} />
					<Flex alignItems={"center"}>
						<Text fontSize="sm" fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src="/verified.png" w={4} h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"sm"} w={36} textAlign="right" color={"gray.light"}>
						{formatDistanceToNow(new Date(post.createdAt))} ago
					</Text>
					{currentUser?._id === user._id && (
						<DeleteIcon
							size={20}
							onClick={(e) => deletePost(e, post._id)}
							cursor={"pointer"}
						/>
					)}
				</Flex>
			</Flex>
			<Text my={3}>{post.text}</Text>
			<Box
				borderRadius={6}
				overflow="hidden"
				border={"1px solid"}
				borderColor={"gray.light"}
			>
				{post.img && <Image src={post.img} w="full" />}
			</Box>
			<Flex gap={3} my={3}>
				<Actions post={post} />
			</Flex>

			<Divider my={4} />
			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize="2xl">👋</Text>
					<Text color="gray.light">Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>
			<Divider my={4} />
			{post.replies.length > 0 ? (
				post.replies.map((reply) => (
					<Comment
						key={reply._id}
						reply={reply}
						isLastReply={
							reply._id === post.replies[post.replies.length - 1]._id
						}
					/>
				))
			) : (
				<p>Have no one comment :((</p>
			)}
		</>
	);
};

export default PostPage;
