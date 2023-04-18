interface iRoomOptions {
	name: string;
	public: boolean;
};

const rooms: { [k: string]: iRoomOptions } = {};

// generate a unique room code with a length of 6 letters
const createRoom = () => {
	const room = generateRoomId();

	rooms[room] = { name: 'Mijn room :3', public: true };
	return room;
};

const roomExists = (room: string) => {
	return rooms[room] ? true : false;
};

const destroyRoom = (room: string) => {};

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

export { createRoom, roomExists };
