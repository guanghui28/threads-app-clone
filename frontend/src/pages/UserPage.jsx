import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const [fetching, setFetching] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		const getPosts = async () => {
			setFetching(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();

				if (data.error) {
					return showToast("Error", data.error, "error");
				}

				setPosts([...data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setFetching(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts]);

	if (!user && loading)
		return (
			<Flex justifyContent="center">
				<Spinner size="xl" />
			</Flex>
		);

	if (!user && !loading) return <h1>User not found!</h1>;

	return (
		<>
			<UserHeader user={user} />

			{!fetching && posts.length === 0 && <h1>User has no posts.</h1>}
			{fetching && (
				<Flex justifyContent={"center"}>
					<Spinner size="xl" my={12} />
				</Flex>
			)}
			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</>
	);
};

export default UserPage;
