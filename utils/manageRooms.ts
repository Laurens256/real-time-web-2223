const rooms = new Set();

// generate a unique room code with a length of 6 letters
const createRoom = () => {
	const room = generateRoomId();
	rooms.add(room);
	console.log(room);
	return room;
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
	} while (rooms.has(result));

	return result;
};

export { createRoom };
