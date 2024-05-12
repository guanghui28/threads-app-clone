import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
		} else {
			showToast("Error", "Invalid type", "error");
			setImgUrl(null);
		}
	};

	return { imgUrl, handleImageChange };
};

export default usePreviewImage;
