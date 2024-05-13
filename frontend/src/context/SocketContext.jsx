import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import io from "socket.io-client";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
	const context = useContext(SocketContext);
	return context;
};

const SocketContextProvider = ({ children }) => {
	const user = useRecoilValue(userAtom);
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		const socket = io("http://localhost:5000", {
			query: {
				userId: user?._id,
			},
		});

		setSocket(socket);

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		return () => socket && socket.close();
	}, [user?._id]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketContextProvider;
