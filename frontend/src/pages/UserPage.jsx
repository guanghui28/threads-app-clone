import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
	return (
		<>
			<UserHeader />
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
