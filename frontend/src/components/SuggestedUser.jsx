import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

const SuggestedUser = ({ user }) => {
	const { handleFollowUnFollow, updating, following } = useFollowUnFollow(user);

	return (
		<Flex justifyContent={"space-between"} alignItems={"center"} gap={2}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize="sm" fontWeight="bold">
						{user.name}
					</Text>
					<Text fontSize="sm" color="gray.light">
						{user.username}
					</Text>
				</Box>
			</Flex>

			<Button
				justifySelf={"flex-end"}
				size="sm"
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: 0.8,
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
	);
};

export default SuggestedUser;
