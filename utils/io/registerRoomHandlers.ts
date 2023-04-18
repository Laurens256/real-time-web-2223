import { createRoom, roomExists } from '../manageRooms.js';

const randomNames = ['John', 'Paul', 'George', 'Ringo', 'Pete'];
let i = 0;

const registerRoomHandlers = (io: any, socket: any) => {
	let test: any;
	socket.on('room:create', () => {
		const room = createRoom();
		test = room
		socket.join(room);

		socket.emit('room:join:success', { id: room, name: randomNames[i] });

		i = i === randomNames.length - 1 ? 0 : i + 1;
	});

	socket.on('room:join', (room: string) => {
		if (roomExists(room)) {
			socket.join(room);

			socket.emit('room:join:success', { id: room, name: randomNames[i] });
			i = i === randomNames.length - 1 ? 0 : i + 1;
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});

	socket.on('room:leave', (room: string) => {
		socket.leave(room);
	});
};

export { registerRoomHandlers };
