interface iRoomOptions {
	adminId: string;
	users: { id: string; name: string }[];
	playing: boolean;
}

const rooms: { [roomId: string]: iRoomOptions } = {};

// generate a unique room code with a length of 6 letters
const createRoom = () => {
	const room = generateRoomId();

	rooms[room] = { adminId: '', users: [], playing: false };
	return room;
};

const togglePlay = (room: string, playing: boolean) => {
	if (room in rooms) {
		rooms[room].playing = playing;
	}
};

const roomExists = (room: string) => {
	return rooms[room] ? true : false;
};

const destroyRoom = (room: string) => {
	if (room in rooms) {
		delete rooms[room];
	}
};

const userJoin = (room: string, user: { id: string; name: string; admin?: boolean }) => {
	user.admin = user.admin ? user.admin : false;
	if (room in rooms) {
		rooms[room].users.push(user);

		if (rooms[room].adminId === '') {
			rooms[room].adminId = user.id;
		}
	}
};

const userLeave = (room: string, userId: string) => {
	if (room in rooms) {
		rooms[room].users = rooms[room].users.filter((u) => u.id !== userId);

		if (rooms[room].adminId === userId) {
			rooms[room].adminId = rooms[room].users[0]?.id;
		}

		// 5 second delay to destroy room so it doesn't get destroyed on reload
		setTimeout(() => {
			if (rooms[room].users.length === 0) {
				destroyRoom(room);
			}
		}, 5000);
	}
};

const getRoomAdmin = (room: string) => {
	if (room in rooms) {
		return rooms[room].adminId;
	}
	return '';
};

const getRoomMembers = (room: string) => {
	if (room in rooms) {
		return rooms[room].users;
	}
	return [];
};

const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
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

export {
	createRoom,
	roomExists,
	userJoin,
	userLeave,
	getRoomMembers,
	togglePlay,
	getRoomAdmin
};
