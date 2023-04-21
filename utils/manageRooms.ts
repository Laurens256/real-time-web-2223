interface iRoomOptions {
	name: string;
	public: boolean;
	users: { id: string; name: string }[];
}

const rooms: { [roomId: string]: iRoomOptions } = {};

// generate a unique room code with a length of 6 letters
const createRoom = () => {
	const room = generateRoomId();

	rooms[room] = { name: 'Mijn room :3', public: true, users: [] };
	return room;
};

const roomExists = (room: string) => {
	return rooms[room] ? true : false;
};

const destroyRoom = (room: string) => {};

const userJoin = (room: string, user: { id: string; name: string }) => {
	if (room in rooms) {
		rooms[room].users.push(user);
	}
};

const userLeave = (room: string, userId: string) => {
	if (room in rooms) {
		rooms[room].users = rooms[room].users.filter(
			(u) => u.id !== userId
		);
	}
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charactersLength = characters.length;
const generateRoomId = (): string => {
	let result: string;

	do {
		result = Array.from({ length: 6 }, () =>
			characters.charAt(Math.floor(Math.random() * charactersLength))
		).join('');
	} while (rooms[result]);

	return result;
};

export { createRoom, roomExists, userJoin, userLeave };
