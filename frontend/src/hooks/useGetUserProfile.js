import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
	const showToast = useShowToast();
	const [user, setUser] = useState(null);
	const { username } = useParams();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				if (data.isFrozen) {
					setUser(null);
					return;
				}

				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getUser();
	}, [showToast, username]);

	return { user, loading };
};

export default useGetUserProfile;
