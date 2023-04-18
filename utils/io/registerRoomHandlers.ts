import { createRoom, roomExists } from '../manageRooms.js';

const registerRoomHandlers = (io: any, socket: any) => {
	socket.on('room:create', () => {
		const room = createRoom();

		socket.emit('room:create', room);
		socket.join(room);
	});

	socket.on('room:join', (room: string) => {
		if (roomExists(room)) {
			socket.emit('room:join:success', room);
			socket.join(room);
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});
};

export { registerRoomHandlers };
