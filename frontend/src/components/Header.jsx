import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";

const Header = () => {
	const { logout } = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const user = useRecoilValue(userAtom);
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Flex justifyContent={"space-between"} mt={6} mb={12}>
			{user && (
				<Link as={RouterLink} to="/">
					<AiFillHome size={24} />
				</Link>
			)}
			{!user && (
				<Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("login")}>
					Login
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
				<Flex alignItems="center" gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={24} />
					</Link>
					<Button size="xs" onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}
			{!user && (
				<Link
					as={RouterLink}
					to="/auth"
					onClick={() => setAuthScreen("signup")}
				>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;
