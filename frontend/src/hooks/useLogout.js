import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom";
import selectedConversationAtom from "../atoms/selectedConversationAtom";

const useLogout = () => {
	const setSelectedConversation = useSetRecoilState(selectedConversationAtom);
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const navigate = useNavigate();

	const logout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
			setSelectedConversation({
				_id: "",
				userId: "",
				username: "",
				profilePic: "",
			});
			navigate("/auth");
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	return { logout };
};

export default useLogout;
