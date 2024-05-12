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
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useDeletePost from "../hooks/useDeletePost";
import Comment from "../components/Comment";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const currentUser = useRecoilValue(userAtom);
	const { user, loading } = useGetUserProfile();
	const { pid: postId } = useParams();
	const showToast = useShowToast();
	const { deletePost } = useDeletePost();

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			try {
				const res = await fetch(`/api/posts/${postId}`);
				const data = await res.json();

				if (data.error) {
					return showToast("Error", data.error, "error");
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, postId, setPosts]);

	if (!user || loading) {
		return (
			<Flex justifyContent="center">
				<Spinner size="xl" />
			</Flex>
		);
	}

	if (!currentPost) return null;
	console.log("currentPost: ", currentPost.replies);

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
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>
					{currentUser?._id === user._id && (
						<DeleteIcon
							size={20}
							onClick={(e) => deletePost(e, currentPost._id)}
							cursor={"pointer"}
						/>
					)}
				</Flex>
			</Flex>
			<Text my={3}>{currentPost.text}</Text>
			<Box
				borderRadius={6}
				overflow="hidden"
				border={"1px solid"}
				borderColor={"gray.light"}
			>
				{currentPost.img && <Image src={currentPost.img} w="full" />}
			</Box>
			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
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
			{currentPost.replies.length > 0 ? (
				currentPost.replies.map((reply) => (
					<Comment
						key={reply._id}
						reply={reply}
						isLastReply={
							reply._id ===
							currentPost.replies[currentPost.replies.length - 1]._id
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
