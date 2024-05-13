import { Button, Text } from "@chakra-ui/react";
import useLogout from "../hooks/useLogout";
import useShowToast from "../hooks/useShowToast";

const SettingsPage = () => {
	const { logout } = useLogout();
	const showToast = useShowToast();

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?"))
			return;

		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
			});
			const data = await res.json();

			if (data.error) {
				return showToast("Error", data.error, "error");
			}

			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<>
			<Text my={1} fontWeight="bold">
				Feeze Your account
			</Text>
			<Text my={1}>You can unfreeze your account anytime by logging in</Text>
			<Button size="sm" colorScheme="red" onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};

export default SettingsPage;
