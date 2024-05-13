import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();

	useEffect(() => {
		const feedPosts = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
				}
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		feedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap={10} alignItems={"flex-start"}>
			<Box flex={70}>
				{!loading && posts.length === 0 && (
					<h1>Follow some users to see the feed</h1>
				)}

				{loading && (
					<Flex justifyContent="center">
						<Spinner size="xl" />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box flex={30}>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;
