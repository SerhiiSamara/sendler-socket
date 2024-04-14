import { Server } from 'socket.io';
import 'dotenv/config';
import fetchUser from './api-actions/fetchUser';
const { NEXT_APP_URL, SOCKET_PORT } = process.env;
import { IUser } from './globaltypes/types'

interface ServerToClientEvents {
	message: (user: IUser) => void;

}

interface ClientToServerEvents {
	message: (message: number | undefined, roomname: number | undefined) => void;
}

interface InterServerEvents {
	ping: () => void;
}

interface SocketData {
	name: string;
	age: number;
}

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(Number(SOCKET_PORT), {
	cors: {
		origin: NEXT_APP_URL,
		methods: ["GET", "POST"],
	},
});

export default io.on("connection", (socket) => {
	let timeOut: NodeJS.Timeout;
	console.log("User is connected.");
	socket.on(
		'message',
		async (message, roomName) => {
			const updateBalanceInRealTime = async (i: number) => {
				if (i <= 0) {
					return 0;
				}
				timeOut = setTimeout<[]>(async () => {
					const user: IUser = await fetchUser(message);
					if (user) {
						console.log("User balance", user.balance);
						io.emit('message', user);
					}
					return await updateBalanceInRealTime(i - 10000);
				}, 10000);
			};
			await updateBalanceInRealTime(21600000);
		});
	socket.on("disconnect", (reason) => {
		clearTimeout(timeOut);
		console.log("User is disconnected.");
	})
});

console.log(`Server listening on port ${SOCKET_PORT}`);