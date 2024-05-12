import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";

const Header = () => {
	const user = useRecoilValue(userAtom);
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<Flex justifyContent={"space-between"} mt={6} mb={12}>
			{user && (
				<Link as={RouterLink} to="/">
					<AiFillHome size={24} />
				</Link>
			)}
			<Image
				cursor={"pointer"}
				w={6}
				alt="logo"
				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/>
			{user && (
				<Link as={RouterLink} to={`/${user.username}`}>
					<RxAvatar size={24} />
				</Link>
			)}
		</Flex>
	);
};

export default Header;
