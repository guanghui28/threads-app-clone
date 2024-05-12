import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
	const [user, setUser] = useState(null);
	const { username } = useParams();

	const showToast = useShowToast();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		getUser();
	}, [username, showToast]);

	if (!user) return null;

	return (
		<>
			<UserHeader user={user} />
			<UserPost
				likes={123}
				replies={456}
				postImg="/post1.png"
				postTitle="Let's talk about threads."
			/>
			<UserPost
				likes={123}
				replies={456}
				postImg="/post2.png"
				postTitle="Let's talk about threads."
			/>
			<UserPost
				likes={123}
				replies={456}
				postImg="/post3.png"
				postTitle="Let's talk about threads."
			/>
			<UserPost
				likes={123}
				replies={456}
				postTitle="Let's talk about threads."
			/>
		</>
	);
};

export default UserPage;
