import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import usePreviewImage from "../hooks/usePreviewImage";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const fileRef = useRef(null);
	const { imgUrl, handleImageChange } = usePreviewImage();

	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		password: "",
		bio: user.bio,
	});

	const showToast = useShowToast();

	const handleUpdate = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
			}

			showToast("Success", "Update profile successfully!", "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	return (
		<form onSubmit={handleUpdate}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"md"}
					bg={useColorModeValue("white", "gray.dark")}
					rounded={"xl"}
					boxShadow={"lg"}
					p={6}
				>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						User Profile Edit
					</Heading>
					<FormControl>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar
									size="xl"
									boxShadow={"md"}
									src={imgUrl || user.profilePic}
								/>
							</Center>
							<Center w="full">
								<Button w="full" onClick={() => fileRef.current.click()}>
									Change Image
								</Button>
								<Input
									type="file"
									ref={fileRef}
									hidden
									onChange={handleImageChange}
								/>
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>Full Name</FormLabel>
						<Input
							placeholder="John Doe"
							_placeholder={{ color: "gray.500" }}
							type="text"
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Username</FormLabel>
						<Input
							placeholder="johndoe"
							_placeholder={{ color: "gray.500" }}
							type="text"
							value={inputs.username}
							onChange={(e) =>
								setInputs({ ...inputs, username: e.target.value })
							}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input
							placeholder="your-email@example.com"
							_placeholder={{ color: "gray.500" }}
							type="email"
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							placeholder="Write something your bio"
							_placeholder={{ color: "gray.500" }}
							type="text"
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder="password"
							_placeholder={{ color: "gray.500" }}
							type="password"
							value={inputs.password}
							onChange={(e) =>
								setInputs({ ...inputs, password: e.target.value })
							}
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "red.500",
							}}
						>
							Cancel
						</Button>
						<Button
							bg={"green.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "green.500",
							}}
							type="submit"
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
