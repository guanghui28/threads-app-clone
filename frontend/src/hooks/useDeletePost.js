import { useState } from "react";
import useShowToast from "./useShowToast";
import { useNavigate, useParams } from "react-router-dom";

const useDeletePost = () => {
	const { username } = useParams();
	const showToast = useShowToast();
	const [deleting, setDeleting] = useState(false);
	const navigate = useNavigate();

	const deletePost = async (e, postId) => {
		e.preventDefault();
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		setDeleting(true);
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				return showToast("Error", data.error, "error");
			}

			showToast("Success", "Deleted post successfully", "success");
			navigate(`/${username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setDeleting(false);
		}
	};

	return { deletePost, deleting };
};

export default useDeletePost;
