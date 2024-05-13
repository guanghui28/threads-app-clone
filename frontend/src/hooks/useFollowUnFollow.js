import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useFollowUnFollow = (user) => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(
		user.followers.includes(currentUser?._id)
	);
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnFollow = async () => {
		if (!currentUser) {
			showToast("Error", "Please login first!", "error");
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			if (following) {
				user.followers.pop();
				showToast("Success", `Unfollowed ${user.username}!`, "success");
			} else {
				user.followers.push(currentUser?._id);
				showToast("Success", `Unfollowed ${user.username}!`, "success");
			}

			setFollowing((following) => !following);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	return { handleFollowUnFollow, updating, following };
};

export default useFollowUnFollow;
