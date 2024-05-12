import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";
import { BsImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const user = useRecoilValue(userAtom);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState("");
	const imageRef = useRef(null);
	const { imgUrl, handleImageChange, setImgUrl } = usePreviewImage();
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const [loading, setLoading] = useState(false);

	const showToast = useShowToast();

	const handleTextChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length <= MAX_CHAR) {
			setRemainingChar(MAX_CHAR - inputText.length);
			setPostText(inputText);
		} else {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		}
	};

	const handleCreatePost = async () => {
		if (loading) return;
		setLoading(true);
		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					img: imgUrl,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created successfully", "success");
			setRemainingChar(MAX_CHAR);
			setPostText("");
			setImgUrl("");
			setPosts([data, ...posts]);
			onClose();
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	console.log("post recoil atom: ", posts);

	return (
		<>
			<Button
				position="fixed"
				bottom={10}
				right={5}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={onOpen}
				size={{
					base: "sm",
					md: "lg",
				}}
			>
				<AddIcon />
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder="Post content goes here..."
								onChange={handleTextChange}
								value={postText}
							/>
							<Text
								fontSize="xs"
								fontWeight="bold"
								textAlign="right"
								m={1}
								color="gray.800"
							>
								{remainingChar}/{MAX_CHAR}
							</Text>
							<Input
								type="file"
								hidden
								ref={imageRef}
								onChange={handleImageChange}
							/>
							<BsImageFill
								style={{
									marginLeft: "5px",
									cursor: "pointer",
								}}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>
						{imgUrl && (
							<Flex w="full" position="relative" mt={5}>
								<Image src={imgUrl} alt="Selected image" />
								<CloseButton
									position="absolute"
									top={1}
									right={1}
									bg="gray.800"
									onClick={() => setImgUrl("")}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleCreatePost}
							isLoading={loading}
						>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
